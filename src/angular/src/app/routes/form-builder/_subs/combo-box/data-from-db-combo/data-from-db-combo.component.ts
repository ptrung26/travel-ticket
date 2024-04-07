import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { takeUntil, tap } from '@node_modules/rxjs/internal/operators';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { ComboBoxComponentBase } from '../base-combo-box.component';
import { OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import { FormBuilderExtendStateService } from '@app/routes/form-builder/services/form-builder-extend-state.service';
import { CommonComboDataStateService } from '@app/routes/states/common-combo-data-state.service';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Component({
  selector: 'app-data-from-db-combo',
  templateUrl: './data-from-db-combo.component.html',
  styleUrls: ['./data-from-db-combo.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataFromDbComboComponent),
      multi: true,
    },
    DestroyRxjsService,
  ],
})
export class DataFromDbComboComponent extends ComboBoxComponentBase implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() control: OrdFormItem;
  @Input() tableName = '';
  @Input() cascader = '';
  @Input() isLoadWhenInit = true;
  @Input() isLoadByCascader = false;
  @Input() disabledIfNoData = true;
  @Input() hasAllOptions = false;
  @Input() size = 'default';
  @Input() fontSize = '14px';
  @Output() itemSelectedEmit = new EventEmitter();
  reloadDto: any = {};
  notDataText = 'Không có dữ liệu';
  @Input() nzMaxTagCount: number;
  nzAllowClear = true;

  constructor(private destroy$: DestroyRxjsService, private formBuilderExtendStateService: FormBuilderExtendStateService, private state: CommonComboDataStateService) {
    super();
  }

  ngOnInit() {
    this.initByOrdFormItem();
    if (this.isMulti) {
      // setTimeout(() => {
      this.nzMode = 'multiple';
      // });
    }
    // this.resetKeySessionStorage();
    if (this.isLoadWhenInit === true) {
      this.getServiceData();
    }
    this.initNgModelChangeCascader();
    this.state.reload$.pipe(takeUntil(this.destroy$)).subscribe((d) => {
      if (d === true) {
        this.state.getData(this.reloadDto);
      }
    });
  }

  initNgModelChangeCascader() {
    // sử dụng để handler clear giá trị khi thay đổi select Cascader
    if (this.isLoadByCascader && AppUtilityService.isNotNull(this.control.option.cascaderField)) {
      ora.event.on('ngModelChangeCascader' + this.control.option.cascaderField, this.markMustSetNull);
    }
  }

  markMustSetNull = () => {
    this.isMustSetNull = true;
    // tự động cập nhật về false
    setTimeout(() => {
      this.isMustSetNull = false;
    }, 686);
  };

  initByOrdFormItem() {
    const type = this.control.option.formBuilderType;
    if (type === 'phongBanByDichVuSelect') {
      this.disabledIfNoData = false;
      this.notDataText = 'Chọn dịch vụ trước';
    }
    const opt = this.control?.option?.selectOpt;
    if (!AppUtilityService.isNullOrEmpty(opt)) {
      if (!AppUtilityService.isNullOrEmpty(opt?.nzMaxTagCount)) {
        this.nzMaxTagCount = opt.nzMaxTagCount;
      }
      if (!AppUtilityService.isNullOrEmpty(opt.nzAllowClear)) {
        this.nzAllowClear = opt.nzAllowClear;
      }
      if (opt?.nzMode) {
        this.nzMode = opt?.nzMode;
      }
    }
  }

  getServiceData() {
    let key = `${this.tableName}${this.cascader ? this.cascader : ''}`;
    // if(this.control.option.cascaderFieldType == "list")
    // {
    //     key = `${this.tableName}${this.cascader ? this.cascader.replace(',','-') : ''}`;
    // }
    this.state
      .data$(key)
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap((result) => {
          this.formBuilderExtendStateService.setSelectOptions(this.control, result);
        })
      )
      .subscribe((result) => {
        if (AppUtilityService.isNotAnyItem(result)) {
          this.setDataSourceFromResultService([]);
        } else {
          let filterIsActive = _.filter(result, (it) => {
            // tslint:disable-next-line:triple-equals
            return it.isActive == true;
          });
          if (this.hasAllOptions == true) {
            let optionAll = [{ value: '-1', displayText: '--Tất cả--' }];
            filterIsActive = optionAll.concat(filterIsActive);
          }
          this.setDataSourceFromResultService(filterIsActive);
        }
      });
    this.reloadDto = {
      keyCache: key,
      type: 'table',
      cascader: this.cascader,
      name: this.tableName,
      dataOption: this.control.option
    };
    this.state.getData(this.reloadDto);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isLoadByCascader === true) {
      if (changes.cascader) {
        setTimeout(() => {
          if (this.isMustSetNull) {
            this.setValueNull();
            ora.event.trigger('ngModelChangeCascader' + this.control.dataField);
            this.isMustSetNull = false;
          }
          if (AppUtilityService.isNullOrEmpty(changes.cascader.currentValue) === true) {
            this.setListOfOption([]);
            return;
          }
          this.getServiceData();
        }, 168);
      }
    }
  }

  emitItemSelected() {
    ora.event.trigger('ngModelChangeCascader' + this.control.dataField);
    // tslint:disable-next-line:triple-equals
    const f = this.optionListSource.find((x) => x.value == this._value);
    this.itemSelectedEmit.emit(f);
  }

  getNzSelectDisable() {
    return this._isDisabled || (this.disabledIfNoData === true && this.optionListSource.length === 0);
  }

  checkAll() {
    const arrValueAll = [];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.optionList.length; index++) {
      arrValueAll.push(this.optionList[index].value);
    }
    this._value = arrValueAll;
    this.onChangeValue(this._value);
  }

  removeAll() {
    this._value = [];
    this.onChangeValue(this._value);
  }

  ngOnDestroy(): void {
    if (this.isLoadByCascader && AppUtilityService.isNotNull(this.control.option.cascaderField)) {
      ora.event.off('ngModelChangeCascader' + this.control.option.cascaderField, this.markMustSetNull);
    }
  }
}
