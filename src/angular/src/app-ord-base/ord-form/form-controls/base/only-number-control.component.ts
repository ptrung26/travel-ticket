import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-only-number',
  template: `
    <input
      nz-input
      [nzSize]="control.size"
      [style.padding]="control?.padding"
      [style.fontSize]="control?.fontSize"
      numbersOnlyFormBuilder
      [(ngModel)]="dataForm[control.dataField]"
      (ngModelChange)="onChangeFormItem()"
      class="ord-dynamic-input"
      [disabled]="control.disabled"
      [placeholder]="control.placeholder"
      maxlength="{{ control.maxlength }}"
    />
  `,
})
export class OnlyNumberControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];

  ngOnInit(): void { }

  onChangeFormItem() {
    if (this.control.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }
}
