import { Injectable } from '@angular/core';
import { OrdFormItem } from '@app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import * as _ from 'lodash';
import { FORM_TYPE } from '@app-ord-base/ord-form/dynamic-form/ord-form-item-base';
import { OfSelectType } from '@app-ord-base/ord-form/services/of-select';
import { AppUtilityService } from '@app-ord-base/services/app-utility.service';

// Orenda form = Of
@Injectable()
export class OfService {
  static builderBase(type: FORM_TYPE, label: string, dataField: string, width: number, required: boolean = false, opt: Partial<OrdFormItem> = null): OrdFormItem {
    return {
      ...opt,
      label,
      dataField,
      width,
      required,
      type
    };
  }

  static builderCheckBox(label: string, dataField: string, width: number, required: boolean = false, opt: Partial<OrdFormItem> = null): OrdFormItem {
    return this.builderBase('check-box', ' ', dataField, width, required, {
      ...opt,
      option: {
        checkBoxLabel: label
      }
    });
  }

  static builderSelect(select: OfSelectType, label: string, dataField: string, width: number, required = false, opt: Partial<OrdFormItem> = null): OrdFormItem {
    const f = this.builderBase('form-builder', label, dataField, width, required, opt);
    return {
      ..._.omit(f, ['option']),
      type: 'form-builder',
      option: {
        ...f?.option,
        formBuilderType: select
      }
    };
  }

  static builderThangSelect(label: string, dataField: string, width: number, required = false, opt: Partial<OrdFormItem> = null) {
    const lst = _.map(AppUtilityService.arrayIncrease(1, 12), t => {
      return { label: '' + t, value: '' + t };
    });
    const f: OrdFormItem = {
      type: 'select',
      dataField,
      label,
      width,
      required,
      option: {
        data: lst,
        selectOpt: {
          nzAllowClear: false,
          nzMode: 'default'
        },
        ...opt?.option
      },
      initDataValue: '' + ((new Date()).getMonth() + 1),
      ..._.omit(opt, ['option'])
    };
    return f;
  }

  static builderNamSelect(label: string, dataField: string, width: number, required = false, opt: Partial<OrdFormItem> = null) {
    const yearNow = (new Date()).getFullYear();
    const lst = _.map(AppUtilityService.arrayIncrease(yearNow - 2, yearNow + 2), t => {
      return { label: '' + t, value: '' + t };
    });
    const f: OrdFormItem = {
      type: 'select',
      dataField,
      label,
      width,
      required,
      option: {
        data: lst,
        selectOpt: {
          nzAllowClear: false,
          nzMode: 'default'
        },
        ...opt?.option
      },
      initDataValue: '' + yearNow,
      ..._.omit(opt, ['option'])
    };
    return f;
  }

  static builderTuNgayDenNgay(tuNgay: {
    label: string;
    dataField: string;
    width: number;
    initDataValue?: any;
    required?: boolean;
    disabled?: boolean;
  },
    denNgay: {
      label: string;
      dataField: string;
      width: number;
      initDataValue?: any;
      required?: boolean;
      disabled?: boolean;
    }): OrdFormItem[] {
    const timeStamp = Number(new Date());
    const maxKey = timeStamp + 'max_' + tuNgay.dataField;
    const minKey = timeStamp + 'min_' + denNgay.dataField;
    const tuNgayDenNgayForm: OrdFormItem[] = [{
      ...tuNgay,
      type: 'date',
      abpEventKey: {
        changeDateMax: maxKey
      },
      handlerOnChange: (dataForm) => {
        let d: Date = null;
        if (!AppUtilityService.isNullOrEmpty(dataForm[tuNgay.dataField])) {
          d = dataForm[tuNgay.dataField];
        }
        ora.event.trigger(minKey, d);
      }
    },
    {
      ...denNgay,
      type: 'date',
      abpEventKey: {
        changeDateMin: minKey
      },
      handlerOnChange: (dataForm) => {
        let max: Date = null;
        if (!AppUtilityService.isNullOrEmpty(dataForm[denNgay.dataField])) {
          max = dataForm[denNgay.dataField];
        }
        ora.event.trigger(maxKey, max);
      }
    }];
    return _.cloneDeep(tuNgayDenNgayForm);
  }
}
