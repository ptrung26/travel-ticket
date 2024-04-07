import { Component, forwardRef, Injector, Input, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@app/shared/common/AppComponentBase';
import { AppUtilityService } from '@app/shared/services/app-utility.service';
import { NzSelectModule } from 'ng-zorro-antd/select';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsActiveComboComponent),
  multi: true,
};

@Component({
  selector: 'is-active-combo',
  template: `
    <nz-select
      [(ngModel)]="_value"
      nzAllowClear
      nzPlaceHolder="Trang thái"
      (ngModelChange)="onChangeValue($event)"
      [ngClass]="{ 'border-radius-left-0': borderLT0 }"
      [nzDisabled]="_isDisabled"
      (nzFocus)="(onFocus)"
      style="width:100%"
      [nzCustomTemplate]="defaultTemplate"
    >
      <ng-template #defaultTemplate let-selected>
        <i nz-icon *ngIf="selected.nzValue" class="text-success" nzType="check"></i>
        <i nz-icon *ngIf="!selected.nzValue" class="text-danger" nzType="close"></i>
        {{ selected.nzLabel }}
      </ng-template>
      <nz-option nzCustomContent *ngFor="let option of optionList" [nzValue]="option.value" [nzLabel]="option.displayText">
        <i nz-icon [ngClass]="option.class" [nzType]="option.icon"></i> {{ option.displayText }}
      </nz-option>
    </nz-select>
  `,
  styles: [
    `
      :host ::ng-deep .border-radius-left-0 .ant-select-selection {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
    `,
  ],
  providers: [VALUE_ACCESSOR],
})
export class IsActiveComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
  _value = true;
  public optionList: any[] = [];
  public optionListSource: any[] = [];
  _isDisabled = false;
  @Input() loaiDonVi: any;
  @Input() borderLT0 = true;
  private onChange: Function = (v: any) => {};
  private onTouched: Function = () => {};

  @Input()
  get value() {
    return this._value;
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

  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    let rs = [
      { value: true, displayText: 'Kích hoạt', icon: 'check', class: 'text-success' },
      { value: false, displayText: 'Không sử dụng', icon: 'close', class: 'text-danger' },
    ];
    this.optionList = rs;
    this.optionListSource = this.optionList;
  }

  onChangeValue(event: any): void {
    this.onChange(event);
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  writeValue(obj?: any): void {
    if (obj != undefined) {
      this.value = obj.toString();
    } else {
      this.value = 'undefined';
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }
}
