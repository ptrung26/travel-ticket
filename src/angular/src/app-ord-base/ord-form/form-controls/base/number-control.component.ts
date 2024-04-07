import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-number',
  template: `
      <nz-input-number
              [(ngModel)]="dataForm[control.dataField]"
              (ngModelChange)="onChangeFormItem($event)"
              class="ord-dynamic-input"
              [nzPlaceHolder]="control.placeholder"
              [style]="getWidthForNumber()"
              [nzMin]="control.option.number.min"
              [nzMax]="control.option.number.max"
              [nzStep]="control.option.number.step ? control.option.number.step : 1"
              [nzDisabled]="control.disabled"
      >
      </nz-input-number>
  `
})
export class NumberControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  private isInt = false;

  ngOnInit(): void {
  }

  onChangeFormItem(v) {
    if (this.control?.option?.number?.isInt === true) {
      this.dataForm[this.control.dataField] = this.convertNumberInt(v);
    }
    {
      if (this.control.handlerOnChange) {
        this.control.handlerOnChange(this.dataForm, this.allControls);
      }
    }
  }

  getWidthForNumber() {
    const option = this.control.option;
    let w: number;
    w = option.number.width ? option.number.width : 100;
    return `width:${w}%`;
  }

  private convertNumberInt(v) {
    let d = '' + v;
    d = d.replace(/,/g, '').replace(/\./g, '');
    return d;
  }

}
