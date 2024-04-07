import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormBuilderExtendStateService } from '@app/routes/form-builder/services/form-builder-extend-state.service';
import { CommonComboDataStateService } from '@app/routes/states/common-combo-data-state.service';
import { takeUntil, tap } from '@node_modules/rxjs/internal/operators';
import { OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { ComboBoxComponentBase } from '../base-combo-box.component';

@Component({
  selector: 'app-common-enum-combo',
  templateUrl: './common-enum-combo.component.html',
  styleUrls: ['./common-enum-combo.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonEnumComboComponent),
      multi: true,
    },
    DestroyRxjsService,
  ],
})
export class CommonEnumComboComponent extends ComboBoxComponentBase implements OnInit, ControlValueAccessor {
  @Input() control: OrdFormItem;
  @Input() typeEnum = '';
  @Input() size = 'default';
  @Input() fontSize = '14px';
  @Output() itemSelectedEmit = new EventEmitter();
  reloadDto: any = {};
  nzMaxTagCount = 1;
  nzAllowClear = true;

  constructor(private destroy$: DestroyRxjsService, private formBuilderExtendStateService: FormBuilderExtendStateService, private state: CommonComboDataStateService) {
    super();
  }

  ngOnInit() {
    this.initByOrdFormItem();
    this.reloadDto = {
      keyCache: this.typeEnum,
      type: 'enum',
      cascader: null,
      name: this.typeEnum,
    };
    this.state.getData(this.reloadDto);
    this.initSubState();

    // this.keySessionStorage = 'common-enum-combo-' + this.typeEnum;
    // this.callServiceGetData(this.combodataServiceProxy.appenum(this.typeEnum));
  }

  private initSubState() {
    this.state
      .data$(this.typeEnum)
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap((result) => {
          this.formBuilderExtendStateService.setSelectOptions(this.control, result);
        })
      )
      .subscribe((result) => {
        this.setDataSourceFromResultService(result);
      });
    this.state.reload$.pipe(takeUntil(this.destroy$)).subscribe((d) => {
      if (d === true) {
        this.state.getData(this.reloadDto);
      }
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
    if (this.isMulti) {
      setTimeout(() => {
        this.nzMode = 'multiple';
        this._value = [];
      });
    }
  }

  emitItemSelected() {
    // tslint:disable-next-line:triple-equals
    const f = this.optionListSource.find((x) => x.value == this._value);
    this.itemSelectedEmit.emit(f);
  }
}
