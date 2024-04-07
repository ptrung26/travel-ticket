import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ord-upsert-drawer',
  templateUrl: './ord-upsert-drawer.component.html',
  styleUrls: ['./ord-upsert-drawer.component.scss']
})
export class OrdUpsertDrawerComponent implements OnInit {
  @Input() pageTitle = '';
  visible = false;
  @Input() btnGroupMode: 'saveContinue' | 'viewOnly' | 'noButton' | 'saveOnly' = 'saveContinue';
  @Output() saveEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter();
  @Output() chuyenCheDoSuaEvent = new EventEmitter();
  @Input() isGrayBackGround = false;
  @Input() isButtonOnTop = false;
  tiepTucCheck = false;

  constructor() {
  }

  ngOnInit(): void {

  }

  open(): void {
    this.visible = true;
    this.tiepTucCheck = false;
    if (this.isGrayBackGround) {
      setTimeout(() => {
        $('.upsert-content').parent().addClass('gray-bg-drawer-body');
      }, 666);
    }
  }

  close() {
    this.visible = false;
    this.closeEvent.emit();
  }

  save(close: boolean) {
    this.saveEvent.emit(close);
  }

  onHotKey(event: KeyboardEvent) {
    // F11
    if (event.keyCode === 122) {
      this.save(true);
      return false;
    }
    // f10
    if (event.keyCode === 121) {
      this.save(false);
      return false;
    }
  }

  chuyenCheDoSua() {
    this.chuyenCheDoSuaEvent.emit();
    this.btnGroupMode = 'saveOnly';
  }
}
