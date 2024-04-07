import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import * as selectMapData from './map-form/select-define.json';

interface IComboDataFromDbConfig {
  tableName: string;
  isLoadWhenInit: boolean;
  isLoadByCascader: boolean;
  isXNKhangDinh?: boolean;
  isDieuTri?: boolean;
  isXNSangLoc?: boolean;
}

export type FormBuilderType =
  | string
  | 'common-enum'
  | 'data-from-db-select'
  | 'co-so-y-te-select'
  | 'co-so-yte-da-co-dai-ly-select'
  | 'tree-view-select'
  | 'switch-auto-compelete'
  | 'benh-nhan-search'
  | 'so-the-bhyt'
  | 'csyt-with-ma'
  | 'giay-chung-sinh-search'
  | 'co-so-attp-search'
  | 'nhan-khau-search'
  | 'tai-san-search'
  | 'duoc-pham-search'
  | 'duoc-pham-table-search'
  | 'benh-icd-search'
  | 'ma-icd-select'
  | 'benh-nhan-dang-khuyet-tat'
  | 'benh-nhan-nguyen-nhan-khuyet-tat'
  | 'muc-do-khuyet-tat'
  | 'goi-cuoc-tablecombo';

@Component({
  selector: 'dynamic-form-builder',
  templateUrl: './form-builder.component.html',
})
export class FormBuilderComponent implements OnInit {
  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true }) dynamicComponent: ViewContainerRef;
  @Input() formItem: OrdFormItem;
  @Input() dataForm: any = {};
  formType: FormBuilderType;
  typeEnumCommon = '';
  comboDataFromDbConfig: IComboDataFromDbConfig = {
    tableName: '',
    isLoadByCascader: false,
    isLoadWhenInit: true,
  };
  private selectMap: any = (selectMapData as any).default;

  constructor() { }

  ngOnInit(): void {
    const option = this.formItem.option;
    this.formType = option.formBuilderType;
    this.mapSelectFormControl();
    this.mapAutoCompelete();
  }

  mapSelectFormControl() {
    const map = this.selectMap[this.formType];
    if (AppUtilityService.isNullOrEmpty(map) === false) {
      if (map.type === 'enum') {
        this.formType = 'common-enum';
        this.typeEnumCommon = map.name;
      } else if (map.type === 'table') {
        this.formType = 'data-from-db-select';
        this.comboDataFromDbConfig.tableName = map.name;
        this.comboDataFromDbConfig.isLoadWhenInit = map.init;
        this.comboDataFromDbConfig.isLoadByCascader = map.cascader;
        this.comboDataFromDbConfig.isDieuTri = this.formItem.option.isDieuTri;
        this.comboDataFromDbConfig.isXNKhangDinh = this.formItem.option.isXNKhangDinh;
        this.comboDataFromDbConfig.isXNSangLoc = this.formItem.option.isXNSangLoc;
      } else if (map.type === 'dictionary') {
        this.formType = 'data-from-db-select';
        this.comboDataFromDbConfig.tableName = map.name;
      } else if (map.type === 'tree') {
        this.formType = 'tree-view-select';
        this.comboDataFromDbConfig.tableName = map.name;
        this.comboDataFromDbConfig.isLoadWhenInit = map.init;
        this.comboDataFromDbConfig.isLoadByCascader = map.cascader;
      }
    }
  }

  mapAutoCompelete() {
    // định nghĩa với hậu tố Auto
    if (this.formType.endsWith('Auto') === true) {
      this.formType = 'switch-auto-compelete';
    }
  }

  onChangeItemSelected(d: any) {
    if (this.formItem?.formControlChangeSubject) {
      this.formItem.formControlChangeSubject.next(d);
    }
    if (this.formItem?.handlerOnChange) {
      this.formItem.handlerOnChange(this.dataForm, d);
    }
  }
}
