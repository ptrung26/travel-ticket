
import { Observable, Subject } from '@node_modules/rxjs';
import { TemplateRef } from '@angular/core';
import { IOrdSelectOpt } from '../form-controls/base/select-control.component';
import { OrdCustomnValidate } from './validate-dynamic-form.component';
import { FormBuilderType } from '@app/routes/form-builder/form-builder.component';

export type FORM_TYPE =
  | string
  | 'note'
  | 'text'
  | 'textarea'
  | 'check-box'
  | 'radio'
  | 'select'
  | 'switch'
  | 'date'
  | 'date-ranger'
  | 'month'
  | 'hour'
  | 'currency'
  | 'number'
  | 'only-number'
  | 'number-tooltip'
  | 'password'
  | 'input-with-search'
  | 'blank'
  | 'form-builder'
  | 'file'
  | 'template'
  | 'search-button'
  | 'templateRef';
type initDataValueType = string | number | boolean | Date | 'sessionBenhVienId' | 'sessionTinhId' | 'sessionHuyenId' | 'sessionXaId';

export interface IOrdFormItemBase {
  label?: string;
  labelHtml?: string;
  classCss?: string;
  size?: string;
  fontSize?: string;
  padding?: string;
  type: FORM_TYPE;
  dataField?: string;
  dataNote?: any;
  initDataValue?: initDataValueType;
  width?: number;
  widthMobile?: number;
  widthDesktop?: number;
  required?: boolean;
  errEmpty?: string;
  ignoreCheckNull?: boolean;
  placeholder?: string;
  option?: {
    typeCombo?: string;
    title?: string;
    placeholder?: string;
    checkBoxLabel?: string;
    //dùng cho đơn vị cơ sở
    isDieuTri?: boolean;
    isXNSangLoc?: boolean;
    isXNKhangDinh?: boolean;
    data?: {
      label?: string;
      value?: string | boolean | number | any;
    }[];
    asyncData?: Observable<any>;
    currency?: {
      prefix?: string;
      suffix?: string;
      precision?: number;
    };
    number?: {
      min?: number;
      max?: number;
      step?: number;
      width?: number;
      isInt?: boolean;
    };
    switch?: {
      yes: string;
      no: string;
    };
    // các form tùy biến phức tạp
    formBuilderType?: FormBuilderType;
    isMultiSelect?: boolean;
    nzMaxTagCount?: number;
    // truyền biến để load datasource select giữa các control phụ thuộc nhau (tỉnh,huyện, xa)
    cascaderField?: string;
    cascaderFieldType?: string; // list hoặc string hoặc number
    searchControlOption?: {
      hasAddBtn?: boolean;
      hasInfoBottom?: boolean;
      abpKeyGetSelected?: string;
      extendOption?: any;
    };
    selectOpt?: IOrdSelectOpt;
    dateOpt?: {
      min?: Date;
      max?: Date;
    };
    rowsTextArea?: number;
  };
  validate?: OrdCustomnValidate[];
  message?: string;
  isAutoSearchWhenChange?: boolean;
  disabled?: boolean | any;
  //thêm tùy chọn tất cả option
  hasAllOptions?: boolean;
  dataOption?: any;
  abpEventKey?: any;
  showSearch?: boolean;
  maxlength?: number;
  // custom disableDate (không lớn hơn ngày hiện tại)
  dateNotGreaterThanCurrent?: boolean;
  // ẩn hiện form control dựa vào điều kiện
  funcShow?: any;
  // form item change subject
  // dùng để lấy item selected trong autocomplete
  formControlChangeSubject?: Subject<any>;
  infoBottomControlHtml?: string;
  handlerOnChange?: any;
  textCapitalize?: boolean;
  templateRef?: TemplateRef<any>;
  usingExtendState?: boolean;
}

export interface IOrdFormSchemaItem {
  value: string | boolean | number | Date;
  valueSubject?: Subject<any>;
  initValue?: initDataValueType;
  formDef: IOrdFormItemBase;
}

export interface IOrdFormSchema {
  [key: string]: IOrdFormSchemaItem;
}
