import { Component, Input } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-text',
  template: `
    <input
      class="ord-dynamic-input {{ control.textCapitalize ? 'text-capitalize' : '' }} "
      nz-input
      [style.padding]="control?.padding"
      [style.fontSize]="control?.fontSize"
      [nzSize]="control.size"
      [(ngModel)]="dataForm[control.dataField]"
      (ngModelChange)="onChangeFormItem()"
      [disabled]="control.disabled"
      [placeholder]="control.placeholder"
      maxlength="{{ control.maxlength }}"
    />
  `,
})
export class TextControlComponent {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];

  onChangeFormItem() {
    if (this.control.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }
}
