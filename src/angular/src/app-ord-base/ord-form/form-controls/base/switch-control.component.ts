import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-switch',
  template: `
    <nz-switch
      [(ngModel)]="dataForm[control.dataField]"
      [nzSize]="control.size"
      (ngModelChange)="onChangeFormItem()"
      [nzCheckedChildren]="control.option && control.option.switch ? control.option.switch.yes : checkedTemplate"
      [nzUnCheckedChildren]="control.option && control.option.switch ? control.option.switch.no : unCheckedTemplate"
      [nzDisabled]="control.disabled"
    >
      <ng-template #checkedTemplate><i nz-icon nzType="check"></i></ng-template>
      <ng-template #unCheckedTemplate><i nz-icon nzType="close"></i></ng-template>
    </nz-switch>
  `,
})
export class SwitchControlComponent implements OnInit {
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
