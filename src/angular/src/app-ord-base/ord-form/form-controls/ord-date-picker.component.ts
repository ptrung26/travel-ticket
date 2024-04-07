import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, Provider, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OrdDatePickerComponent),
  multi: true,
};

@Component({
  selector: 'ord-date-picker',
  template: `
    <div class="main-ora-date" (mouseenter)="mouseEnterMain()" (mouseleave)="mouseLeaveMain()">
      <nz-date-picker
        class="ora-date"
        #refDate
        style="width:100%"
        [nzPlaceHolder]="placeHolder"
        [nzDisabled]="disabled"
        [nzDisabledDate]="disabledDate"
        tabindex="-1"
        [nzSize]="size"
        [style.padding]="padding"
        [style.fontSize]="fontSize"
        [formControl]="control"
        nzFormat="dd/MM/yyyy"
      ></nz-date-picker>
      <input
        #refInput
        class="ora-input-date"
        nz-input
        [nzSize]="size"
        [style.padding]="padding"
        [style.fontSize]="fontSize"
        (focusout)="onFocusOutInputMask()"
        [placeholder]="placeHolder"
        [formControl]="inputValue"
        [textMask]="{ mask: mask }"
      />
      <i class="ora-calendar point" (click)="onClickIcon()" nz-icon [nzType]="nzIcon$ | async" nzTheme="outline"></i>
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
export class OrdDatePickerComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('refDate') refDate: NzDatePickerComponent;
  @ViewChild('refInput') refInput: ElementRef;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() placeHolder = 'Ngày/Tháng/Năm';
  @Input() size = 'default';
  @Input() padding = '0px 7px;';
  @Input() fontSize = '14px';
  mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  $destroy: Subject<boolean> = new Subject<boolean>();
  isWriteValue = false;
  mouseEvent$ = new Subject<string>();
  nzIcon = 'calendar';
  nzIcon$ = new BehaviorSubject<string>('calendar');

  // tslint:disable-next-line:variable-name
  isShowIconCalendar = true;

  get value() {
    return this.control.value;
  }

  set value(v: any) {
    this.control.setValue(v);
  }

  isDisabled = false;

  @Input()
  get disabled() {
    return this.isDisabled;
  }

  set disabled(v: boolean) {
    this.isDisabled = v;
    if (v === true) {
      this.inputValue.disable();
    } else {
      this.inputValue.enable();
    }
  }

  @Input() control = new FormControl({ value: null, disabled: true });
  inputValue: FormControl = new FormControl({ value: '', disabled: false });

  private onChange(v: any) { }

  private onTouched() { }

  onChangeValue(event: any): void {
    this.onChange(event);
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  mouseLeaveMain() {
    this.mouseEvent$.next('mouseLeave');
  }

  mouseEnterMain() {
    this.mouseEvent$.next('mouseEnter');
  }

  constructor() { }

  ngAfterViewInit(): void {
    fromEvent<any>(this.refInput.nativeElement, 'click')
      .pipe(debounceTime(222), takeUntil(this.$destroy))
      .subscribe(() => {
        //this.refDate.picker.showOverlay();
        setTimeout(() => {
          // this will make the execution after the above boolean has changed
          this.refInput.nativeElement.focus();
        });
      });
    this.refDate.nzOnOpenChange.pipe(takeUntil(this.$destroy)).subscribe((o) => {
      if (!o) {
        setTimeout(() => {
          // this will make the execution after the above boolean has changed
          this.refInput.nativeElement.focus();
        });
      }
    });
    this.mouseEvent$
      .pipe(takeUntil(this.$destroy))
      .pipe(debounceTime(222))
      .pipe(
        map((d) => {
          if (d === 'mouseLeave') {
            return 'calendar';
          }
          if (this.disabled) {
            return 'calendar';
          }
          if (AppUtilityService.isNullOrEmpty(this.control.value)) {
            return 'calendar';
          }
          return 'close-circle';
        })
      )
      .pipe(
        tap((icon) => {
          this.nzIcon$.next(icon);
          this.nzIcon = icon;
        })
      )
      .subscribe();
    this.nzIcon$.next('calendar');
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged()).subscribe((result: Date) => {
      if (this.isWriteValue) {
        if (result) {
          const valueText = moment(result).format('DD/MM/YYYY');
          this.inputValue.setValue(valueText);
        }

        this.onChangeValue(result);
      }
    });
    this.inputValue.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100)).subscribe((result) => {
      try {
        const arrStr = result.split('/');
        if (!isNaN(arrStr[0]) && !isNaN(arrStr[1]) && !isNaN(arrStr[2])) {
          const date = moment(result, 'DD/MM/YYYY');
          if (date.isValid()) {
            if (typeof this.disabledDate === 'function') {
              if (this.disabledDate(date.toDate())) {
                this.inputValue.setValue(null);
              } else {
                this.control.setValue(date.toDate());
                //this.refDate.picker.hideOverlay();
              }
            } else {
              this.control.setValue(date.toDate());
              //this.refDate.picker.hideOverlay();
            }
          } else {
            this.control.setValue(null);
          }
        } else {
          this.control.setValue(null);
        }
      } catch (e) {
        this.control.setValue(null);
      }
    });
  }

  //#region base ControlValueAccessor
  writeValue(obj: any): void {
    if (obj) {
      const valueText = moment(obj).format('DD/MM/YYYY');
      this.inputValue.setValue(valueText);
      this.value = moment(obj).toDate();
    } else {
      this.inputValue.setValue('');
      this.value = null;
    }
    this.isWriteValue = true;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  //#endregion

  onFocusOutInputMask() {
    if (AppUtilityService.isNullOrEmpty(this.control.value)) {
      this.inputValue.setValue(null);
    }
  }

  onClickIcon() {
    if (this.disabled) {
      return;
    }
    if (this.nzIcon === 'calendar') {
      //this.refDate.picker.showOverlay();
      return;
    }
    this.nzIcon$.next('calendar');
    this.inputValue.setValue(null);
    this.control.setValue(null);
  }
}
