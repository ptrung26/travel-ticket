import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
//import { BaseComboBoxComponent } from '../base/base-combo-box.component';
import { RestService } from '@abp/ng.core';

import { ComboBoxComponentBase } from '@app/routes/form-builder/_subs/combo-box/base-combo-box.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'base-dynamic-combo',
  template: `
      <nz-select
              nzShowSearch
              nzServerSearch
              nzAllowClear
              nzPlaceHolder="{{ placeHolder }}"
              [nzMode]="nzMode"
              [nzMaxTagCount]="nzMaxTagCount"
              [(ngModel)]="_value"
              [nzDisabled]="_isDisabled"
              (nzFocus)="(onFocus)"
              style="width:100%"
              nz-tooltip
              [nzTooltipTitle]="enumTooltipTemplate"
              [nzTooltipTrigger]="tooltipTrigger"
              (ngModelChange)="onChangeValue($event)"
              (nzOnSearch)="search($event)"
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
      useExisting: forwardRef(() => BaseDynamicComboComponent),
      multi: true,
    },
  ],
})
export class BaseDynamicComboComponent extends ComboBoxComponentBase implements OnInit, OnChanges, ControlValueAccessor {
  @Input() TableName: string = '';
  @Input() DefaultCode: string = '';
  @Input() CascaderId?: number;
  @Input() TrangThai?: number;
  @Input() isNoCache?: boolean;
  @Input() ArrCodeSkiped = [];
  @Input() nzMaxTagCount: any = 1;
  @Input() isDefaultFirstRecord?: boolean = false;
  @Output() eventChange = new EventEmitter();
  @Input() tooltipTrigger = null;

  constructor(private _httpClient: HttpClient, private restService: RestService) {
    super();
  }

  ngOnInit() {
    if (this.isMulti) {
      this.nzMode = 'multiple';
    }
    if (AppUtilityService.isNullOrEmpty(this.placeHolder)) {
      this.placeHolder = 'Chọn...';
    }
    this.getDataSourceFromServer();
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ArrCodeSkiped) {
      this.getDataSourceFromServer();
    }
    if (changes.CascaderId) {
      this.CascaderId = changes.CascaderId.currentValue;
      this.getDataSourceFromServer();
    }
  }

  getDataSourceFromServer() {
    const req: any = {
      tableName: this.TableName,
      cascaderId: this.CascaderId,
      trangThai: this.TrangThai,
    };
    const key = 'combo-data-' + this.TableName + this.CascaderId + this.TrangThai;
    const cache = sessionStorage.getItem(key);
    if (cache && !this.isNoCache) {
      let lst = JSON.parse(cache);

      if (this.ArrCodeSkiped != null) {
        if (this.ArrCodeSkiped.length > 0) {
          this.ArrCodeSkiped.forEach((item) => {
            lst = lst.filter((p) => p.value != item);
          });
        }
      }
      this.setListOfOption(lst);

      //set value default
      this.getValueDefault(lst);

      return;
    }

    let url = '/api/danh-muc/common/getfromdatabase';
    this.restService
      .request<any, any>(
        {
          method: 'post',
          body: req,
          url: url,
        },
        {
          apiName: 'danhMuc',
        },
      )
      .subscribe((d) => {
        let lst = _.map(d, (it) => {
          return Object.assign(
            {
              ...it,
            },
            {
              value: it.value,
              displayText: AppUtilityService.isNullOrEmpty(it.displayText) ? '' : it.displayText,
              data: it.data,
              fts: AppUtilityService.getFullTextSearch(AppUtilityService.isNullOrEmpty(it.displayText) ? '' : it.displayText),
            },
          );
        });
        sessionStorage.setItem(key, JSON.stringify(lst));

        if (this.ArrCodeSkiped != null) {
          if (this.ArrCodeSkiped.length > 0) {
            this.ArrCodeSkiped.forEach((item) => {
              lst = lst.filter((p) => p.value != item);
            });
          }
        }
        this.setListOfOption(lst);

        //set value default
        this.getValueDefault(lst);
      });
  }

  getValueDefault(lst: any[]) {
    setTimeout(() => {
      if (!AppUtilityService.isNullOrEmpty(this.DefaultCode) && AppUtilityService.isNullOrEmpty(this._value)) {
        let obj = lst.find((m) => m.data?.code == this.DefaultCode);
        if (obj) {
          this._value = obj.value;
          this.onChangeValue(obj.value);
        }
      }
      if (this.isMulti != true) {
        if (!this.optionListSource.some((p) => p.value == this._value)) {
          this._value = null;
          this.setValueChange(this._value);
        }
      }
      if (this.isDefaultFirstRecord == true && AppUtilityService.isNullOrEmpty(this._value)) {
        let obj = lst[0];
        if (obj) {
          this._value = obj.value;
          this.onChangeValue(obj.value);
        }
      }
      if (this.isMulti != true) {
        if (!this.optionListSource.some((p) => p.value == this._value)) {
          this._value = null;
          this.setValueChange(this._value);
        }
      }
    }, 50);
  }

  setValueChange(event) {
    this._value = event;
    this.onChangeValue(event);
  }

  onChangeValue(event) {
    this.onChange(event);
    if (this.isMulti != true) {
      let obj = this.optionList.find((m) => m.value == event);
      this.eventChange.emit(obj);
    } else {
      if (this._value != null) {
        let ListChosen = this.optionList.filter((m) => this._value.includes(m.value));
        this.eventChange.emit(ListChosen);
      } else {
        this.eventChange.emit([]);
      }
    }
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
