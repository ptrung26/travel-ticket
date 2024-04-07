import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'reset-search-button',
    template: `
     <button nz-button nzType="primary" (click)="resetSearchEvent.emit()">
     <i nz-icon nzType="redo"></i> Bỏ lọc
      </button>`,
})
export class ResetSearchButtonComponent {
  @Input() placeholder = 'Nhập từ khóa. Ấn enter để tìm kiếm';
  @Input() searchModel: any;
  @Output() searchEvent = new EventEmitter();
    @Output() resetSearchEvent = new EventEmitter();
}
