import { Input, Component, forwardRef, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
//import { BaseComboBoxComponent } from '../base/base-combo-box.component';

import { RestService } from '@abp/ng.core';
import { ComboBoxComponentBase } from '@app/routes/form-builder/_subs/combo-box/base-combo-box.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'enum-combo',
  template: `
    <nz-select
      nzShowSearch
      nzServerSearch
      [nzAllowClear]="allowClear"
      nzPlaceHolder="{{ placeHolder }}"
      [nzMode]="nzMode"
      [nzMaxTagCount]="nzMaxTagCount"
      [(ngModel)]="_value"
      [nzDisabled]="_isDisabled"
      (nzFocus)="(onFocus)"
      style="width:100%"
      (ngModelChange)="onChangeValue($event)"
      (nzOnSearch)="search($event)"
      nz-tooltip
      [nzTooltipTitle]="enumTooltipTemplate"
      [nzTooltipTrigger]="tooltipTrigger"
    >
      <nz-option *ngFor="let item of optionList" [nzLabel]="item.displayText" [nzValue]="item.value"></nz-option>
    </nz-select>
    <ng-template #enumTooltipTemplate let-thing>
      <ng-container *ngIf="_value.length > 1; else templateElse">
        <nz-tag *ngFor="let i of _value">{{ getDisplayTextByValue(i) }}</nz-tag>
      </ng-container>
      <ng-template #templateElse>
        <span>{{ getDisplayTextByValue(_value) }}</span>
      </ng-template>
    </ng-template>
  `,
  styles: [
    `
      .ant-select,
      .ant-select-multiple.ant-select-selector {
        height: auto !important;
      }
      .ant-select-multiple .ant-select-selector {
        height: auto !important;
      }
      .ant-tag {
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: normal;
        color: #425a70;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumComboComponent),
      multi: true,
    },
  ],
})
export class EnumComboComponent extends ComboBoxComponentBase implements OnInit, OnChanges, ControlValueAccessor {
  @Input() EnumName: string = '';
  @Input() ArrIdsMap?: any;
  @Input() nzMaxTagCount: any = 1;
  @Input() tooltipTrigger = null;
  constructor(private _httpClient: HttpClient, private restService: RestService) {
    super();
  }

  ngOnInit() {
    if (this.isMulti) {
      this.nzMode = 'multiple';
    }
    this.getDataSourceFromServer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ArrIdsMap) {
      this.getDataSourceFromServer();
    }
  }
  getDataSourceFromServer() {
    //   this.setListOfOption(JSON.parse(cache));
    //   return;
    // }
    let url = '/api/danh-muc/common/GetAppEnum?type=' + this.EnumName;
    this.restService
      .request<any, any>(
        {
          method: 'get',
          url: url,
        },
        {
          apiName: 'danhMuc',
        },
      )
      .subscribe((d) => {
        let lst = _.map(d, (it) => {
          return Object.assign(
            {},
            {
              value: Number(it.value),
              displayText: it.displayText,
              fts: AppUtilityService.getFullTextSearch(it.displayText),
            },
          );
        });
        if (this.ArrIdsMap != null && this.ArrIdsMap.length > 0) {
          lst = lst.filter((m) => this.ArrIdsMap.includes(m.value));
        }
        this.setListOfOption(lst);
      });
  }

  getDisplayTextByValue(value: any) {
    if (value) {
      var item = this.optionList.find((op) => op.value == value);
      if (item) {
        return item.displayText;
      } else {
        return null;
      }
    }
  }
}
