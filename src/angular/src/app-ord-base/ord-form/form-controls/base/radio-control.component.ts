import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-radio',
  template: `
    <nz-radio-group
      [(ngModel)]="dataForm[control.dataField]"
      [nzSize]="control.size"
      [style.padding]="control?.padding"
      [style.fontSize]="control?.fontSize"
      (ngModelChange)="onChangeFormItem()"
      [nzDisabled]="control.disabled"
      style="width: 100%"
    >
      <label *ngFor="let op of control.option.data" nz-radio [nzValue]="op.value">{{ op.label }}</label>
    </nz-radio-group>
  `,
})
export class RadioControlComponent implements OnInit {
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
