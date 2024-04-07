import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';

import { ComboBoxComponentBase } from '@app/routes/form-builder/_subs/combo-box/base-combo-box.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'common-dropdown-combo',
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonDropDownComboComponent),
      multi: true,
    },
  ],
})
export class CommonDropDownComboComponent extends ComboBoxComponentBase implements OnInit, OnChanges, ControlValueAccessor {
  @Input() Source: any = [];
  @Input() DefaultCode: string = '';
  @Input() ArrCodeSkiped = [];
  @Input() nzMaxTagCount: any = 1;
  @Input() typeValue: 'number' | 'string' = 'string';
  @Output() eventChange = new EventEmitter();
  constructor() {
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
    let lst = _.map(this.Source, (it) => {
      return Object.assign(
        {
          ...it,
        },
        {
          value: this.typeValue == 'string' ? it.value + '' : Number(it.value),
          displayText: AppUtilityService.isNullOrEmpty(it.displayText) ? '' : it.displayText,
          data: it.data,
          fts: AppUtilityService.getFullTextSearch(it.displayText),
        },
      );
    });
    this.setListOfOption(lst);
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
