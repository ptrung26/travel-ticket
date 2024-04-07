import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-check-box',
  template: `
      <label nz-checkbox [(ngModel)]="dataForm[control.dataField]"
             (ngModelChange)="onChangeFormItem()"
             [nzDisabled]="control.disabled">{{ control.option.checkBoxLabel }}</label>
  `
})
export class CheckBoxControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];

  ngOnInit(): void {
  }

  onChangeFormItem() {
    if (this.control?.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }
}
