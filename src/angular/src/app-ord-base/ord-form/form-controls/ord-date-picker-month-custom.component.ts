import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, Provider, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OrdDatePickerMonthCustomComponent),
  multi: true,
};

@Component({
  selector: 'ord-date-picker-month-custom',
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
        nzMode="month"
        [formControl]="control"
        nzFormat="MM/yyyy"
      ></nz-date-picker>
      <input #refInput class="ora-input-date" nz-input [placeholder]="placeHolder" [(ngModel)]="inputValue"
      (blur)="onBlur($event)" (ngModelChange)="onChangeValue($event)" [textMask]="{ mask: mask }" />
      <i class="ora-close" *ngIf="showClearIcon()" (click)="onClearClick()" nz-icon nzType="close-circle" nzTheme="outline"></i>
      <i class="ora-calendar" *ngIf="showCalendarIcon()" (click)="refDate.picker.showOverlay()" nz-icon nzType="calendar" nzTheme="outline"></i>
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
export class OrdDatePickerMonthCustomComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('refDate') refDate: NzDatePickerComponent;
  @ViewChild('refInput') refInput: ElementRef;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() placeHolder = 'Tháng/Năm';
  mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  $destroy: Subject<boolean> = new Subject<boolean>();
  isWriteValue = false;

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

  // @Input() control = new FormControl({ value: null, disabled: true });
  // inputValue: FormControl = new FormControl({ value: '', disabled: false });
  @Input() control = new FormControl({
    value: '',
    disabled: false
  });
  inputValue: any = '';


  private onChange(v: any) { }

  private onTouched() { }

  onChangeValue(event: any): void {
    this.onChange(event);

    //this.refDate.picker.hideOverlay();
    if (event == undefined || (event != undefined && event.length <= 10 && event.toString().indexOf('_') !== -1)) {

      return;
    } else {
      var checkValidDate = moment(event, 'MM/YYYY', true).isValid();
      if (checkValidDate == false) {
        this.inputValue = undefined;
        //this.messages = 'Nhập ngày/tháng/năm';
        return;
      }
    }
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  mouseLeaveMain() {
    this.isShowIconCalendar = true;
  }

  mouseEnterMain() {
    setTimeout(() => {
      this.isShowIconCalendar = AppUtilityService.isNullOrEmpty(this.inputValue);
    });
  }

  constructor() { }

  ngAfterViewInit(): void {
    fromEvent<any>(this.refInput.nativeElement, 'click')
      .pipe(debounceTime(400), takeUntil(this.$destroy))
      .subscribe(() => {
        this.onInputClick();
      });
  }

  onInputClick() {
    //this.refDate.picker.showOverlay();
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.refInput.nativeElement.focus();
    });
  }

  onClearClick() {
    if (this.disabled === true) {
      return;
    }
    this.inputValue = null;
    this.isShowIconCalendar = true;
    this.onChangeValue(null);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  onBlur(event: any) {
    try {
      const arrStr = this.inputValue.split('/');
      if (!isNaN(arrStr[0]) && !isNaN(arrStr[1])) {
        const date = moment(this.inputValue, 'MM/YYYY');
        if (date.isValid()) {
          if (typeof this.disabledDate === 'function') {
            if (this.disabledDate(date.toDate())) {
              this.inputValue = null;
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
  }
  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged()).subscribe((result: Date) => {
      if (this.isWriteValue && result) {
        if (result) {
          const valueText = moment(result).format('MM/YYYY');
          this.inputValue = valueText;
        }

        this.onChangeValue(result);
      }
    });


    // this.inputValue.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100)).subscribe((result) => {
    //   debugger
    //   try {
    //     const arrStr = result.split('/');
    //     if (!isNaN(arrStr[0]) && !isNaN(arrStr[1]) && !isNaN(arrStr[2])) {
    //       const date = moment(result, 'MM/YYYY');
    //       if (date.isValid()) {
    //         if (typeof this.disabledDate === 'function') {
    //           if (this.disabledDate(date.toDate())) {
    //             this.inputValue = null;
    //           } else {
    //             this.control.setValue(date.toDate());
    //             this.refDate.picker.hideOverlay();
    //           }
    //         } else {
    //           this.control.setValue(date.toDate());
    //           this.refDate.picker.hideOverlay();
    //         }
    //       } else {
    //         this.control.setValue(null);
    //       }
    //     } else {
    //       this.control.setValue(null);
    //     }
    //   } catch (e) {
    //     this.control.setValue(null);
    //   }
    // });
  }



  //#region base ControlValueAccessor
  writeValue(obj: any): void {
    if (obj) {
      const valueText = moment(obj).format('MM/YYYY');
      this.inputValue = valueText;
      this.value = moment(obj).toDate();
    } else {
      this.inputValue = '';
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

  showCalendarIcon() {
    return this.isShowIconCalendar || this.disabled === true;
  }

  showClearIcon() {
    if (this.disabled === true) {
      return false;
    }
    return !this.isShowIconCalendar;
  }

  //#endregion
  setInputTextEmpty() {
    this.inputValue = '';
  }
}
