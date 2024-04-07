import { Component, Input, OnInit } from '@angular/core';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-currency',
  template: `
    <input
      currencyMask
      nz-input
      [nzSize]="control.size"
      [(ngModel)]="dataForm[control.dataField]"
      (ngModelChange)="onChangeFormItem()"
      class="ord-dynamic-input"
      [disabled]="control.disabled"
      [placeholder]="control.placeholder"
      maxlength="{{ control.maxlength }}"
      [options]="options"
    />
  `,
  styles: [
    `
      input::placeholder {
        text-align: left;
      }
    `,
  ],
})
export class CurrencyControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  options: any = {};

  ngOnInit(): void {
    const opt = this.control.option;
    this.options = {
      prefix: opt.currency.prefix,
      suffix: opt.currency.suffix,
      thousands: '.',
      decimal: ',',
      precision: opt.currency.precision,
    };
  }

  onChangeFormItem() {
    if (this.control?.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }
}
