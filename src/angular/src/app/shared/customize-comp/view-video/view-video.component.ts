import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

interface IVideoHTML extends HTMLVideoElement {
  requestPictureInPicture(): any;
}

@Component({
  selector: 'view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.scss'],
})
export class ViewVideoComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() path = '';
  @Input() loading: boolean;
  @Output() loadingChange = new EventEmitter<boolean>();
  @ViewChild('container') container: ElementRef<HTMLDivElement>;
  @ViewChild('video') mainVideo: ElementRef<IVideoHTML>;
  @ViewChild('videoTimeline') videoTimeline: ElementRef<HTMLDivElement>;
  @ViewChild('progressBar') progressBar: ElementRef<HTMLDivElement>;
  @ViewChild('volume') volumeBtn: ElementRef<HTMLSpanElement>;
  @ViewChild('mute') mute: ElementRef<HTMLSpanElement>;
  @ViewChild('input') volumeSlider: ElementRef<HTMLInputElement>;
  @ViewChild('currentTime') currentVidTime: ElementRef<HTMLParagraphElement>;
  @ViewChild('videoDuration') videoDuration: ElementRef<HTMLParagraphElement>;
  @ViewChild('backward') skipBackward: ElementRef<HTMLSpanElement>;
  @ViewChild('forward') skipForward: ElementRef<HTMLSpanElement>;
  @ViewChild('play') playBtn: ElementRef<HTMLSpanElement>;
  @ViewChild('pause') pauseBtn: ElementRef<HTMLSpanElement>;
  @ViewChild('playbackSpeed') speedBtn: ElementRef<HTMLSpanElement>;
  @ViewChild('speedOptions') speedOptions: ElementRef<HTMLUListElement>;
  @ViewChild('picInPic') pipBtn: ElementRef<HTMLSpanElement>;
  @ViewChild('fullscreen') fullScreenBtn: ElementRef<HTMLSpanElement>;

  timer: any;
  constructor() {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges?.path?.currentValue) {
      this.viewVideo(simpleChanges.path.currentValue);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.hideControls();
    this.addEventListener();
  }

  hideControls() {
    if (this.mainVideo?.nativeElement?.paused) return;
    this.timer = setTimeout(() => {
      this.container.nativeElement.classList.remove('show-controls');
    }, 3000);
  }

  addEventListener() {
    this.container.nativeElement.addEventListener('mousemove', () => {
      this.container.nativeElement.classList.add('show-controls');
      clearTimeout(this.timer);
      this.hideControls();
    });

    this.videoTimeline.nativeElement.addEventListener('mousemove', (e: any) => {
      let timelineWidth = this.videoTimeline.nativeElement.clientWidth;
      let offsetX = e.offsetX;
      let percent = Math.floor((offsetX / timelineWidth) * this.mainVideo.nativeElement.duration);
      const progressTime = this.videoTimeline.nativeElement.querySelector('span');
      offsetX = offsetX < 20 ? 20 : offsetX > timelineWidth - 20 ? timelineWidth - 20 : offsetX;
      progressTime.style.left = `${offsetX}px`;
      progressTime.innerText = this.formatTime(percent);
    });

    this.videoTimeline.nativeElement.addEventListener('click', (e: any) => {
      let timelineWidth = this.videoTimeline.nativeElement.clientWidth;
      this.mainVideo.nativeElement.currentTime = (e.offsetX / timelineWidth) * this.mainVideo.nativeElement.duration;
    });

    this.mainVideo.nativeElement.addEventListener('timeupdate', (e: any) => {
      let { currentTime, duration } = e.target;
      let percent = (currentTime / duration) * 100;
      this.progressBar.nativeElement.style.width = `${percent}%`;
      this.currentVidTime.nativeElement.innerText = this.formatTime(currentTime);
    });

    this.mainVideo.nativeElement.addEventListener('loadeddata', () => {
      this.videoDuration.nativeElement.innerText = this.formatTime(this.mainVideo.nativeElement.duration);
    });

    this.mainVideo.nativeElement.addEventListener('timeupdate', (e: any) => {
      let { currentTime, duration } = e.target;
      let percent = (currentTime / duration) * 100;
      this.progressBar.nativeElement.style.width = `${percent}%`;
      this.currentVidTime.nativeElement.innerText = this.formatTime(currentTime);
    });

    this.mainVideo.nativeElement.addEventListener('loadeddata', () => {
      this.videoDuration.nativeElement.innerText = this.formatTime(this.mainVideo.nativeElement.duration);
    });

    this.volumeBtn.nativeElement.addEventListener('click', () => {
      this.volumeBtn.nativeElement.classList.add('hidden');
      this.mute.nativeElement.classList.remove('hidden');
      this.mainVideo.nativeElement.volume = 0.0;
      this.volumeSlider.nativeElement.value = this.mainVideo.nativeElement.volume + '';
    });

    this.mute.nativeElement.addEventListener('click', () => {
      this.mute.nativeElement.classList.add('hidden');
      this.volumeBtn.nativeElement.classList.remove('hidden');
      this.mainVideo.nativeElement.volume = 0.5;
      this.volumeSlider.nativeElement.value = this.mainVideo.nativeElement.volume + '';
    });

    this.volumeSlider.nativeElement.addEventListener('input', (e: any) => {
      this.mainVideo.nativeElement.volume = e.target.value;
      if (e.target.value == 0) {
        this.volumeBtn.nativeElement.classList.add('hidden');
        this.mute.nativeElement.classList.remove('hidden');
        return;
      }

      this.mute.nativeElement.classList.add('hidden');
      this.volumeBtn.nativeElement.classList.remove('hidden');
    });

    this.speedOptions.nativeElement.querySelectorAll('li').forEach((option) => {
      option.addEventListener('click', () => {
        this.mainVideo.nativeElement.playbackRate = parseFloat(option.dataset.speed);
        this.speedOptions.nativeElement.querySelector('.active').classList.remove('active');
        option.classList.add('active');
      });
    });

    this.fullScreenBtn.nativeElement.addEventListener('click', () => {
      if (document.fullscreenElement) {
        return document.exitFullscreen();
      }
      this.container.nativeElement.requestFullscreen();
    });

    this.speedBtn.nativeElement.addEventListener('click', () => this.speedOptions.nativeElement.classList.toggle('show'));
    this.pipBtn.nativeElement.addEventListener('click', () => this.mainVideo?.nativeElement.requestPictureInPicture());
    this.skipBackward.nativeElement.addEventListener('click', () => (this.mainVideo.nativeElement.currentTime -= 5));
    this.skipForward.nativeElement.addEventListener('click', () => (this.mainVideo.nativeElement.currentTime += 5));
    this.mainVideo.nativeElement.addEventListener('play', () => {
      this.playBtn.nativeElement.classList.add('hidden');
      this.pauseBtn.nativeElement.classList.remove('hidden');
    });
    this.mainVideo.nativeElement.addEventListener('pause', () => {
      this.playBtn.nativeElement.classList.remove('hidden');
      this.pauseBtn.nativeElement.classList.add('hidden');
    });
    this.playBtn.nativeElement.addEventListener('click', () => this.mainVideo.nativeElement.play());
    this.pauseBtn.nativeElement.addEventListener('click', () => this.mainVideo.nativeElement.pause());
    this.videoTimeline.nativeElement.addEventListener('mousedown', () =>
      this.videoTimeline.nativeElement.addEventListener('mousemove', this.draggableProgressBar),
    );
    document.addEventListener('mouseup', () =>
      this.videoTimeline.nativeElement.removeEventListener('mousemove', this.draggableProgressBar),
    );
  }

  draggableProgressBar(e: any) {
    let timelineWidth = this.videoTimeline?.nativeElement?.clientWidth;
    this.progressBar.nativeElement.style.width = `${e.offsetX}px`;
    this.mainVideo.nativeElement.currentTime = (e.offsetX / timelineWidth) * this.mainVideo.nativeElement.duration;
    this.currentVidTime.nativeElement.innerText = this.formatTime(this.mainVideo.nativeElement.currentTime);
  }

  formatTime(time: number) {
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    if (hours == 0) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  viewVideo(url: string) {
    this.loadingChange.emit(true);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
      this.loadingChange.emit(false);
      const blob = xhr.response;
      const video = document.querySelector('video') as HTMLVideoElement;
      video.src = window.URL.createObjectURL(blob);
      video.volume = 0.5;
      video.play();
    };
    xhr.send();
  }
}
