import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonComboDataStateService } from '@app/routes/states/common-combo-data-state.service';
import { SubscriptionService } from '@node_modules/@abp/ng.core';
import { OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { ComboBoxTreeComponentBase } from '../base-combo-box-tree.component';

@Component({
  selector: 'app-tree-view-select',
  templateUrl: './tree-view-select.component.html',
  styleUrls: ['./tree-view-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeViewSelectComponent),
      multi: true,
    },
    SubscriptionService,
  ],
})
export class TreeViewSelectComponent extends ComboBoxTreeComponentBase implements OnInit, OnChanges, ControlValueAccessor {
  @Input() control: OrdFormItem;
  @Input() tableName = '';
  @Input() cascader = '';
  @Input() dataOption = [];
  @Input() isLoadWhenInit = true;
  @Input() isLoadByCascader = false;
  @Input() disabledIfNoData = true;
  @Input() size = 'default';
  @Input() fontSize = '14px';
  @Output() itemSelectedEmit = new EventEmitter();
  reloadDto: any = {};
  notDataText = 'Không có dữ liệu';
  nzMaxTagCount = 1;
  nzAllowClear = true;

  constructor(private subscription: SubscriptionService, private state: CommonComboDataStateService) {
    super();
  }

  ngOnInit() {
    this.initByOrdFormItem();
    if (this.isLoadWhenInit === true) {
      this.getServiceData();
    }
    this.subscription.addOne(this.state.reload$, {
      next: (d) => {
        if (d === true) {
          this.state.getData(this.reloadDto);
        }
      },
    });
  }

  initByOrdFormItem() {
    const opt = this.control?.option?.selectOpt;
    if (!AppUtilityService.isNullOrEmpty(opt)) {
      if (!AppUtilityService.isNullOrEmpty(opt?.nzMaxTagCount)) {
        this.nzMaxTagCount = opt.nzMaxTagCount;
      }
      if (!AppUtilityService.isNullOrEmpty(opt.nzAllowClear)) {
        this.nzAllowClear = opt.nzAllowClear;
      }
    }
  }

  getServiceData() {
    const key = `${this.tableName}${this.cascader ? this.cascader : ''}`;
    this.subscription.addOne(this.state.data$(key), {
      next: (result) => {
        this.setListOfOption(result);
      },
    });
    this.reloadDto = {
      keyCache: key,
      type: 'tree',
      cascader: this.cascader,
      name: this.tableName,
      data: this.dataOption,
    };
    this.state.getData(this.reloadDto);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isLoadByCascader === true) {
      if (changes.cascader) {
        const changesCascader = changes.cascader;
        this.isMustSetNullWhenLoadDataByCascader = changesCascader.firstChange === false && AppUtilityService.isNullOrEmpty(changesCascader.previousValue) === false;
        if (AppUtilityService.isNullOrEmpty(changes.cascader.currentValue) === true) {
          this.setListOfOption([]);
          return;
        }
        this.getServiceData();
      }
    }
  }

  emitItemSelected() {
    // tslint:disable-next-line:triple-equals
    const f = this.optionListSource.find((x) => x.Id == this._value);
    this.itemSelectedEmit.emit(f);
  }

  getNzSelectDisable() {
    let isDisabled = this._isDisabled || (this.disabledIfNoData === true && (!this.optionListSource || this.optionListSource.length === 0));
    if (isDisabled == true) {
      this.nzAllowClear = false;
    } else {
      this.nzAllowClear = true;
    }
    return isDisabled;
  }
}
