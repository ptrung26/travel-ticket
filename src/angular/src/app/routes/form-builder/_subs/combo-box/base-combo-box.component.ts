import { Directive, Input } from '@angular/core';
import * as _ from 'lodash';
import { NzSelectModeType } from '@node_modules/ng-zorro-antd/select/select.types';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Directive()
export abstract class ComboBoxComponentBase {
  @Input() placeHolder = '- Chọn -';
  @Input() isMulti: any;
  @Input() allowClear: boolean;
  nzMode: NzSelectModeType = 'default';
  // tslint:disable-next-line:variable-name
  _value: any | string | number = '';
  public optionList: any[] = [];
  public optionListSource: any[] = [];
  // tslint:disable-next-line:variable-name
  _isDisabled = false;
  _isAllowClear = false;
  loading = false;
  isMustSetNull = false;
  private maxOptionRender = 100;
  public onChange = (v: any) => {};
  private onTouched = () => {};

  @Input()
  get value() {
    return this.value;
  }

  set value(v: any) {
    this._value = v;
  }

  @Input()
  get disabled() {
    return this._isDisabled;
  }

  set disabled(v: boolean) {
    this._isDisabled = v;
  }

  onChangeValue(event: any): void {
    this.onChange(event);
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  trackByFn(index: number, item: any) {
    if (item && item.value) {
      return item.value;
    }
    return index;
  }

  search(value: string): void {
    if (AppUtilityService.isNotAnyItem(this.optionListSource) === true) {
      this.optionList = [];
      return;
    }
    const searchTxt = AppUtilityService.getFullTextSearch(value);
    let fOption = this.optionListSource;
    if (AppUtilityService.isNotNull(searchTxt)) {
      fOption = _.filter(fOption, (s) => {
        const ftsVietTat = AppUtilityService.searchVietTat(s.displayText);
        const checkVietTat = ftsVietTat.indexOf(searchTxt) > -1;
        if (AppUtilityService.isNullOrEmpty(s.fts)) {
          s.fts = AppUtilityService.getFullTextSearch(s.displayText);
        }
        return s.fts.indexOf(searchTxt) > -1 || checkVietTat;
      });
    }
    this.optionList = _.slice(fOption, 0, this.maxOptionRender);
  }

  setDataSourceFromResultService(result) {
    const lst = _.map(result, (it) => {
      return Object.assign(
        {},
        {
          value: it.value,
          displayText: it.displayText,
          data: it.data,
          fts: AppUtilityService.getFullTextSearch(it.displayText),
        },
      );
    });
    this.setListOfOption(lst);
    // sessionStorage.setItem(this.keySessionStorage, JSON.stringify(lst));
  }

  setListOfOption(d) {
    this.optionListSource = d;
    this.optionList = _.slice(this.optionListSource, 0, this.maxOptionRender);
  }

  addRecordNullOfList(value: number, lst) {
    if (value != null) {
      let obj = this.optionList.find((m) => m.value == value);
      if (obj == null) {
        let recordSelected = lst.find((m) => m.value == value);
        this.optionList.push(recordSelected);
      }
    }
  }

  setValueNull() {
    setTimeout(() => {
      this._value = null;
      this.onChangeValue(null);
    });
  }
}
