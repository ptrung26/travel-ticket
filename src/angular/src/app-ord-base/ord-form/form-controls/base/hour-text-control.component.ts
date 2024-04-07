import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

@Component({
  selector: 'ord-base-control-hour-text',
  template: `
    <input
      nz-input
      [nzSize]="control.size"
      [style.padding]="control?.padding"
      [style.fontSize]="control?.fontSize"
      class="ord-dynamic-input gio-control text-uppercase"
      (focusout)="convert()"
      [(ngModel)]="dataForm[control.dataField]"
      (ngModelChange)="onChangeFormItem()"
      [textMask]="{ mask: maskTime }"
      [disabled]="control.disabled"
      placeholder="__:__"
    />
  `,
  styles: [
    `
      .gio-control {
        letter-spacing: 5px;
        max-width: 100px;
      }
    `,
  ],
})
export class HourTextControlComponent implements OnInit {
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  maskTime = [/\d/, /\d/, ':', /\d/, /\d/];

  ngOnInit(): void {
    if (this.control) {
      this.control.validate = [
        {
          type: 'custom',
          errMessage: 'Nhập đúng định dạng HH:mm (24h)',
          funcCheck: (dto) => {
            const gio = dto[this.control.dataField];
            if (!AppUtilityService.isNullOrEmpty(gio)) {
              return gio.indexOf('_') > -1;
            }
            return false;
          },
        },
        {
          type: 'custom',
          errMessage: 'Giờ trong khoảng 0-23',
          funcCheck: (dto) => {
            const gio = dto[this.control.dataField];
            if (!AppUtilityService.isNullOrEmpty(gio)) {
              const spl = gio.split(':');
              const h = Number(spl[0]);
              return h < 0 || h > 24;
            }
            return false;
          },
        },
        {
          type: 'custom',
          errMessage: 'Phút trong khoảng 0-59',
          funcCheck: (dto) => {
            const gio = dto[this.control.dataField];
            if (!AppUtilityService.isNullOrEmpty(gio)) {
              const spl = gio.split(':');
              const m = Number(spl[1]);
              return m < 0 || m > 59;
            }
            return false;
          },
        },
      ];
    }
  }

  onChangeFormItem() {
    if (this.control.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }

  convert() {
    const gio = this.dataForm[this.control.dataField];
    const spl = gio.split(':');
    const h = Number(spl[0]);
    const m = Number(spl[1]);
    if (!(h >= 0 && h < 24) || !(m >= 0 && m <= 59)) {
      this.dataForm[this.control.dataField] = moment(new Date()).format('HH:mm');
      this.onChangeFormItem();
    }
  }
}
