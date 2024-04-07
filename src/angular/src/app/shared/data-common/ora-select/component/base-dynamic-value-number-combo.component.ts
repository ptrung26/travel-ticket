import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
//import { BaseComboBoxComponent } from '../base/base-combo-box.component';
import { RestService } from '@abp/ng.core';

import { ComboBoxComponentBase } from '@app/routes/form-builder/_subs/combo-box/base-combo-box.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'base-dynamic-value-number-combo',
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
      (ngModelChange)="onChangeValue($event)"
      (nzOnSearch)="search($event)"
    >
      <nz-option *ngFor="let item of optionList" [nzLabel]="item.displayText" [nzValue]="item.value"></nz-option>
    </nz-select>
  `,
  styles: [
    `
      .ant-select,
      .ant-select-multiple .ant-select-selector {
        height: auto !important;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseDynamicValueNumberComboComponent),
      multi: true,
    },
  ],
})
export class BaseDynamicValueNumberComboComponent extends ComboBoxComponentBase implements OnInit, OnChanges, ControlValueAccessor {
  @Input() TableName: string = '';
  @Input() DefaultCode: string = '';
  @Input() ArrCodeSkiped = [];
  @Input() nzMaxTagCount: any = 1;
  @Output() eventChange = new EventEmitter();
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

  ngAfterViewInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ArrCodeSkiped) {
      this.getDataSourceFromServer();
    }
  }

  getDataSourceFromServer() {
    const req: any = {
      tableName: this.TableName,
    };
    const key = 'combo-data-' + this.TableName + '-number';
    const cache = sessionStorage.getItem(key);
    if (cache) {
      let lst = JSON.parse(cache);

      if (this.ArrCodeSkiped != null) {
        if (this.ArrCodeSkiped.length > 0) {
          this.ArrCodeSkiped.forEach((item) => {
            lst = lst.filter((p) => p.value != item);
          });
        }
      }
      this.setListOfOption(lst);

      setTimeout(() => {
        if (this.isMulti != true) {
          if (!this.optionListSource.some((p) => p.value == this._value)) {
            this._value = null;
            this.setValueChange(this._value);
          }
        }
      }, 50);

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
              value: Number(it.value),
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

        setTimeout(() => {
          if (this.isMulti != true) {
            if (!this.optionListSource.some((p) => p.value == this._value)) {
              this._value = null;
              this.setValueChange(this._value);
            }
          }
        }, 50);
      });
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
}
