import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn-add-item',
  template: `
      <button nz-button nzType="{{typeBtn}}" [disabled]="disabled" [nzSize]="size" class="{{sClass}}" (click)="clickEvent.emit()" style="margin-left: 7px;">
      <i nz-icon nzType="{{icon}}" nzTheme="outline"></i> {{text}}
      <!-- <i class="{{icon}} mr-2"></i> -->
      </button>`

})
export class BtnAddItemComponent {
  @Input() typeBtn = 'primary';
  @Input() sClass = '';
  @Input() text = '';
  @Input() title = '';
  //@Input() icon = 'fa fa-plus';
  @Input() icon = '';
  @Input() disabled: any;
  @Input() hoyKey: string;
  @Input() size: string;
  @Output() clickEvent = new EventEmitter();
}
