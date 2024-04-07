import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CurrentUserDto } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { NavigationEnd, Router } from '@node_modules/@angular/router';

@Component({
  selector: 'layout-menu-top',
  templateUrl: './layout-menu-top.component.html',
  styleUrls: ['./layout-menu-top.component.scss'],
})
export class LayoutMenuTopComponent implements OnInit, AfterViewChecked {
  @ViewChild('btnRight') btnRight: any;
  @ViewChild('btnLeft') btnLeft: any;
  @Input() menusCongViec: any[];
  @Input() menusDM: any[]; // danh mục
  @Input() menusQT: any[]; // quản trị 
  @Input() currentUser: CurrentUserDto;

  listMenuActive = [
    {
      key: 1,
      url: '/cong-viec/',
    },
    {
      key: 2,
      url: '/danh-muc/',
    },
    {
      key: 3,
      url: '/admin/',
    },
   
   
  ];
  keyActive = null;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.activeMenuInit();
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const findItem = this.listMenuActive.find((x) => event.url.includes(x.url));
        if (findItem) {
          this.keyActive = findItem.key;
        } else {
          this.keyActive = null;
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    this.showHideButton();
    window.onresize = this.showHideButton;
  }

  activeMenuInit() {
    const findItem = this.listMenuActive.find((x) => document.location.pathname.includes(x.url));
    if (findItem) {
      this.keyActive = findItem.key;
    }
  }

  //Prev/Next button
  showHideButton() {
    const menu = document.querySelector('ul[menulayouthorizontal]') as HTMLUListElement;
    const clientWidth = menu.clientWidth;
    const scrollWidth = menu.scrollWidth;
    const scrollLeft = menu.scrollLeft;
    const width = menu.offsetWidth;
    if (scrollLeft) {
      this.hiddenButtonLeft(false);
      if (scrollWidth - width <= scrollLeft) {
        this.hiddenButtonRight(true);
      } else {
        this.hiddenButtonRight(false);
      }
    } else {
      if (clientWidth < scrollWidth) {
        this.hiddenButtonRight(false);
      } else {
        this.hiddenButtonRight(true);
      }
      this.hiddenButtonLeft(true);
    }
  }

  hiddenButtonLeft(hidden: boolean) {
    if (hidden) {
      this.btnLeft.elementRef.nativeElement.classList.remove('active');
    } else {
      this.btnLeft.elementRef.nativeElement.classList.add('active');
    }
  }

  hiddenButtonRight(hidden: boolean) {
    if (hidden) {
      this.btnRight.elementRef.nativeElement.classList.remove('active');
    } else {
      this.btnRight.elementRef.nativeElement.classList.add('active');
    }
  }

  handleButtonLeft() {
    const menu = document.querySelector('ul[menulayouthorizontal]') as HTMLUListElement;
    menu.scrollTo({
      top: 0,
      left: menu.scrollLeft - 400,
      behavior: 'smooth',
    });
    this.showHideButton();
  }

  handleButtonRight() {
    const menu = document.querySelector('ul[menulayouthorizontal]') as HTMLUListElement;
    menu.scrollTo({
      top: 0,
      left: menu.scrollLeft + 400,
      behavior: 'smooth',
    });
    this.showHideButton();
  }
}
