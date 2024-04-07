import { AfterViewInit, Component, forwardRef, Input, OnDestroy, OnInit, Provider, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OrdOverlayTringgerDirective } from '@app/shared/customize-comp/ord-overlay-tringer/ord-overlay-tringger.directive';
import { NzDatePickerComponent } from '@node_modules/ng-zorro-antd/date-picker';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OraDatePickerTimerComponent),
  multi: true,
};

@Component({
  selector: 'ora-date-picker-timer',
  template: `
    <div clickOutside (mouseenter)="mouseEnterMain()" (mouseleave)="mouseLeaveMain()" (clickOutsideAndOverlay)="clickOutsideAndOverlay()">
      <input
        nz-input
        [ordOverlayTringger]="picker"
        (focusout)="onLeaveInput()"
        [hasBackdrop]="false"
        [placeholder]="placeHolder"
        [formControl]="_inputValue"
        [textMask]="{ mask: _mask }"
        menupositons="bottomLeft"
      />
      <ord-overlay-content #picker>
        <nz-date-picker
          nzInline
          nzShowTime
          [nzDisabledDate]="disabledDate"
          nzFormat="dd/MM/yyyy - HH:mm"
          [formControl]="control"
        ></nz-date-picker>
      </ord-overlay-content>
      <i class="ora-close" [hidden]="_isShowIconCalendar" (click)="onClearClick()" nz-icon nzType="close-circle" nzTheme="outline"></i>
      <i class="ora-calendar" [hidden]="!_isShowIconCalendar" (click)="showOverlay()" nz-icon nzType="calendar" nzTheme="outline"></i>
    </div>
  `,
  styles: [
    `
      .main-ora-date {
        position: relative;
      }

      .ora-date {
        border: 0;
      }

      .ora-input-date {
        position: absolute;
        top: 0;
        left: 0;
      }

      .ora-close {
        position: absolute;
        top: 7px;
        right: 5px;
      }

      .ora-calendar {
        position: absolute;
        top: 7px;
        right: 5px;
      }
    `,
  ],
  providers: [VALUE_ACCESSOR],
})
export class OraDatePickerTimerComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('refDate') refDate: NzDatePickerComponent;
  @ViewChild(OrdOverlayTringgerDirective, { static: true }) dirOverlay: OrdOverlayTringgerDirective;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() placeHolder = 'Ngày/Tháng/Năm - Giờ/Phút';
  _mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, ':', /\d/, /\d/];
  $destroy: Subject<boolean> = new Subject<boolean>();
  _isShowIconCalendar = true;
  private subcriptionInput = Subscription.EMPTY;
  private subcriptionControl = Subscription.EMPTY;

  get value() {
    return this.control.value;
  }

  @Input() set value(v: DateTime) {
    if (v) {
      this.control.setValue(v);
    } else {
      this.control.reset();
    }
  }

  _isDisabled = false;

  @Input()
  get disabled() {
    return this._isDisabled;
  }

  set disabled(v: boolean) {
    this._isDisabled = v;
    if (v) {
      this._inputValue.disable();
      this.control.disable();
    } else {
      this._inputValue.enable();
      this.control.enable();
    }
  }

  @Input() control = new FormControl({ value: '', disabled: false });
  _inputValue: FormControl = new FormControl({ value: undefined, disabled: this._isDisabled });

  private onChange = (v: any) => {};
  private onTouched = () => {};

  constructor() {}

  ngOnInit(): void {
    this.obsInput();
    this.obsControl();
  }

  private obsInput() {
    this.subcriptionInput = this._inputValue.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((result) => {
      this.subcriptionInput.unsubscribe();
      // this.subcriptionControl.unsubscribe();
      try {
        const arrStr = result.split('/');
        if (!isNaN(arrStr[0]) && !isNaN(arrStr[1]) && !isNaN(arrStr[2])) {
          const date = DateTime.fromFormat(result, 'dd/MM/yyyy - HH:mm');
          if (date.isValid) {
            if (typeof this.disabledDate === 'function') {
              if (this.disabledDate(date.toJSDate())) {
                this._inputValue.setValue(undefined);
              } else {
                this.control.setValue(date.toJSDate());
                this.dirOverlay.closeMenu();
              }
            } else {
              this.control.setValue(date.toJSDate());
              this.dirOverlay.closeMenu();
            }
          } else {
            // this.control.reset();
          }
        } else {
          // this.control.reset();
        }
      } catch (e) {
        // this.control.reset();
      }
      this.obsInput();
      // this.obsControl();
    });
  }

  private obsControl() {
    this.subcriptionControl = this.control.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return _.isEqual(prev, curr);
        }),
      )
      .subscribe((result: Date) => {
        const valueText = DateTime.fromJSDate(result).toFormat('dd/MM/yyyy - HH:mm');
        this._inputValue.setValue(valueText);
        this.onChangeValue(DateTime.fromJSDate(result));
        this.dirOverlay.closeMenu();
      });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
    this.subcriptionInput.unsubscribe();
    this.subcriptionControl.unsubscribe();
  }

  onChangeValue(event: DateTime): void {
    this.onChange(event);
    // this.refDate.picker.hideOverlay();
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  clickOutsideAndOverlay() {
    this.dirOverlay.closeMenu();
  }

  mouseLeaveMain() {
    this._isShowIconCalendar = true;
  }

  mouseEnterMain() {
    if (this._inputValue.value && !this.disabled) {
      this._isShowIconCalendar = false;
    } else {
      this._isShowIconCalendar = true;
    }
  }

  onLeaveInput() {
    const result = this._inputValue.value ? this._inputValue.value : '';
    const arrStr = result.split('/');
    if (!isNaN(arrStr[0]) && !isNaN(arrStr[1])) {
      const date = DateTime.fromFormat(result, 'dd/MM/yyyy - HH:mm');
      if (date.isValid) {
        return;
      }
    }
    this._inputValue.reset();
    // this.control.reset();
  }

  showOverlay() {
    if (!this.disabled) {
      this.dirOverlay.openMenu();
    }
  }

  onClearClick() {
    this._inputValue.setValue(undefined);
    this._isShowIconCalendar = true;
  }

  //#region base ControlValueAccessor
  writeValue(obj: DateTime): void {
    this.value = obj;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  //#endregion
}
