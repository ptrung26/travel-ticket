import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ord-upsert-modal',
  templateUrl: './ord-upsert-modal.component.html'
})
export class OrdUpsertModalComponent {
  @Input() pageTitle = '';
  @Input() btnGroupMode: 'saveContinue' | 'saveOnly' = 'saveContinue';
  @Input() nzWidth = 600;
  @Output() saveEvent = new EventEmitter();
  isVisible = false;
  isContinue = false;

  showModal(): void {
    this.isVisible = true;
  }

  save(close: boolean) {
    this.saveEvent.emit(this.isContinue);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // hot key
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.isVisible) {
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

  }
}
