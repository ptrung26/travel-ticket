import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-pwd',
  template: `
      <ord-pwd [(password)]="dataForm[control.dataField]" (passwordChange)="onChangeFormItem()" [placeholder]="control.placeholder"></ord-pwd>
  `
})
export class PassWordControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];

  ngOnInit(): void {
  }

  onChangeFormItem() {
    if (this.control.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }
}
