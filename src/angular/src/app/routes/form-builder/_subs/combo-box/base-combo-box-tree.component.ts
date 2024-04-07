import { Directive, Input } from '@angular/core';
import * as _ from 'lodash';
import { NzSelectModeType } from 'ng-zorro-antd/select';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Directive()
export abstract class ComboBoxTreeComponentBase {
  @Input() placeHolder = '- Chọn -';
  @Input() isMulti: any;
  // tslint:disable-next-line:variable-name
  _value: string = '';
  public optionList: any[] = [];
  public optionListSource: any[] = [];
  // tslint:disable-next-line:variable-name
  _isDisabled = false;
  loading = false;
  isMustSetNullWhenLoadDataByCascader = false;
  private onChange = (v: any) => { };
  private onTouched = () => { };

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

  search(value: string): void {
    if (AppUtilityService.isNotAnyItem(this.optionListSource) === true) {
      this.optionList = [];
      return;
    }
    const searchTxt = AppUtilityService.getFullTextSearch(value);
    this.optionList = _.filter(this.optionListSource, (s) => {
      const ftsVietTat = AppUtilityService.searchVietTat(s.displayText);
      const checkVietTat = ftsVietTat.indexOf(searchTxt) > -1;
      if (AppUtilityService.isNullOrEmpty(s.fts)) {
        s.fts = AppUtilityService.getFullTextSearch(s.displayText);
      }
      return s.fts.indexOf(searchTxt) > -1 || checkVietTat;
    });
  }

  setListOfOption(d) {
    this.optionListSource = d;
    this.optionList = this.buildTreeView(d);
    if (this.isMustSetNullWhenLoadDataByCascader === true) {
      this.checkOptionListContainValue();
    }
    // this.checkOptionListContainValue();
  }

  setValueNull() {
    setTimeout(() => {
      this._value = null;
      this.onChangeValue(null);
    });
  }

  checkOptionListContainValue() {
    if (AppUtilityService.isNullOrEmpty(this._value) === false) {
      // tslint:disable-next-line:triple-equals
      if (this.optionListSource && this.optionListSource.length > 0) {
        const find = this.optionListSource.find((x) => x.key == this._value);
        if (AppUtilityService.isNullOrEmpty(find)) {
          this.setValueNull();
        }
      } else {
        this.setValueNull();
      }
    }
  }

  buildTreeView(data: any) {
    const dataResult = [];
    if (data && data.length > 0) {
      const dataParent = data
        .filter((x) => x.Level === 1)
        .map((parent) => {
          return {
            title: parent.Name,
            key: parent.Id + '',
            level: parent.Level,
            isLeaf: false,
            expanded: true,
            children: [],
          };
        });
      dataParent.forEach((parent) => {
        const childrenItem = data.filter((x) => Number(x.TreeId.split('|')[0]) == Number(parent.key) && x.Level !== 1).sort((a, b) => a.TreeId - b.TreeId);
        if (childrenItem.length > 0) {
          const item = parent;
          item.children = this.buildChildrenTreeView(parent.key, 2, null, childrenItem);
          dataResult.push(item);
        } else {
          parent.isLeaf = true;
          dataResult.push(parent);
        }
      });
    }
    return dataResult;
  }

  buildChildrenTreeView(key: number, thisLevel: number, level: number, data: any) {
    const list = [];
    const childrenItem = data.filter((x) => Number(x.Lv) == thisLevel && x.ParentId == key);
    // tslint:disable-next-line: prefer-for-ord-sf
    for (let i = 0; i < childrenItem.length; i += 1) {
      const treeNode = {
        title: childrenItem[i].Name,
        key: childrenItem[i].Id + '',
        level: childrenItem[i].Lv,
        expanded: false,
        children: [],
        isLeaf: false,
      };
      const dataLevel = data.filter((x) => x.ParentId == childrenItem[i].Id).sort((a, b) => b.TreeId - a.TreeId);
      if (dataLevel.length > 0) {
        level = dataLevel[0].Lv;
      }
      if (thisLevel < level && dataLevel.length > 0) {
        treeNode.children = this.buildChildrenTreeView(childrenItem[i].Id, thisLevel + 1, level, data);
      } else {
        treeNode.isLeaf = true;
      }
      list.push(treeNode);
    }
    return list;
  }
}
