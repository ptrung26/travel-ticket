import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Provider,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  Subject
} from 'rxjs';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';
import * as moment from 'moment';
import {
  NzDatePickerComponent
} from 'ng-zorro-antd/date-picker';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import * as _ from 'lodash';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OrdDatePickerNonDynamicComponent),
  multi: true,
};

@Component({
  selector: 'ord-non-dynamic-date-picker',
  template: `
        <div class="main-ora-date" (mouseenter)="mouseEnterMain()" (mouseleave)="mouseLeaveMain()">
            <nz-date-picker class="ora-date" #refDate style="width:100%" [nzPlaceHolder]="placeHolder"
                            [nzDisabledDate]="disabledDates"
                            [nzDisabled]="_isDisabled || isDisabled"
                            tabindex="-1"
                            [formControl]="control"
                            nzFormat="dd/MM/yyyy" ></nz-date-picker>

             <!-- disabled is not acceptable on nz-input -->
            <input #refInput class="ora-input-date {{(_isDisabled == true)?'ora-input-date-disabled':''}}" nz-input
                   [placeholder]="placeHolder"
                   [formControl]="_inputValue"
                   [textMask]="{mask: _mask}"
                   [readonly]="_isDisabled"
                   [disabled]="_isDisabled"
                   (blur)="onBlur($event)"
                   (ngModelChange)="onChangeValue($event)"/>
            <i class="ora-close" *ngIf="isIcon" [hidden]="_isShowIconCalendar || _isDisabled" (click)="onClearClick()" nz-icon nzType="close-circle"
               nzTheme="outline"></i>
            <i class="ora-calendar" #oraCalendar *ngIf="isIcon" [hidden]="!_isShowIconCalendar || _isDisabled"  nz-icon
            nzType="calendar"
            nzTheme="outline"></i>
        </div>
    `,
  styles: [`
  .main-ora-date {
      position: relative;
      width: 100%;
  }
  .main-ora-date .ant-picker.ant-picker-disabled{
      border: none;
  }
  .ora-date {
      border: 0;
  }
  .ora-input-date{
      background-color: #fff;
  }
  .ora-input-date {
      position: absolute;
      top: 0;
      left: 0
  }

  .ora-close {
     cursor: pointer;
      position: absolute;
      top: 7px;
      right: 5px;
      z-index: 1;
  }

  .ora-calendar {
     cursor: pointer;
      position: absolute;
      top: 7px;
      right: 5px;
      z-index: 1;
  }

  .ora-input-date-disabled{
      color: black;
      background-color: #f5f5f5;
      cursor: not-allowed;
      opacity: 1;
      pointer-events: none;
  }
`],
  providers: [VALUE_ACCESSOR],
})
export class OrdDatePickerNonDynamicComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('refDate') refDate: NzDatePickerComponent;
  @ViewChild('refInput') refInput: ElementRef;
  @ViewChild('oraCalendar') oraCalendar: ElementRef;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() isIcon?: boolean = true;
  @Input() isDisabled?: boolean = false;
  @Input() placeHolder = 'dd/MM/yyyy';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  //@Output() maxDateChange = new EventEmitter();
  _mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  $destroy: Subject<boolean> = new Subject<boolean>();
  isWriteValue = false;
  _isOnChange = false;
  _isShowIconCalendar = true;

  get value() {
    return this.control.value;
  }

  set value(v: any) {
    this.control.setValue(v);
  }

  _isDisabled = false;

  @Input()
  get disabled() {
    return this._isDisabled;
  }

  set disabled(v: boolean) {
    this._isDisabled = v;
  }

  @Input() control = new FormControl({
    value: '',
    disabled: false
  });
  _inputValue: FormControl = new FormControl({
    value: undefined,
    disabled: this._isDisabled
  }, Validators.required);


  private onChange = (v: any) => { };
  private onTouched = () => { };

  ngOnChanges(changes: SimpleChanges): void {

    if (changes && (changes.minDate && changes.minDate.currentValue != changes.minDate.previousValue)
      || (changes.maxDate && changes.maxDate.currentValue != changes.maxDate.previousValue)) {

      //this.refDate.ngOnInit();
    }
    if (changes.minDate) {
      //this.disabledDates(this._inputValue.value);

      this.checkMinDate(changes.minDate.currentValue);
    }
  }
  checkMinDate(minDate) {
    if (minDate != null) {
      let dateInput = this._inputValue.value;
      if (typeof dateInput == 'string') {
        const strDate = this._inputValue.value.split("/").reverse().join("/");
        dateInput = new Date(strDate);
      }
      if (typeof minDate == 'string') {
        const strMinDate = AppUtilityService.dateToStr(minDate).split("/").reverse().join("/");
        let newMinDate = new Date(strMinDate);
        if (dateInput < newMinDate) {
          this._inputValue.setValue(undefined);
        }
      }
      else {
        let newMinDate = new Date(JSON.parse(JSON.stringify(minDate)));
        let newCheckDate = moment(dateInput, "DD/MM/YYYY").format('YYYY-MM-DD');
        let newCheckMinDate = moment(newMinDate, "DD/MM/YYYY").format('YYYY-MM-DD');
        if (newCheckDate < newCheckMinDate) {
          this._inputValue.setValue(undefined);
        }
      }

    }
  }
  onChangeValue(event: any): void {
    this.onChange(event);
    //this.refDate.picker.hideOverlay();
    if (event == undefined || (event != undefined && event.length <= 10 && event.toString().indexOf('_') !== -1)) {

      this._isOnChange = true;
      return;
    } else {
      var checkValidDate = moment(event, 'DD/MM/YYYY', true).isValid();
      if (checkValidDate == false) {
        this._inputValue.setValue(undefined);
        //this.messages = 'Nhập ngày/tháng/năm';
        return;
      }
    }
  }

  onBlur(event: any) {
    if (this.maxDate) {
      let newDate = null;
      if (typeof this._inputValue.value == 'string') {
        const spit = this._inputValue.value.split('/');
        newDate = new Date(parseInt(spit[2]), parseInt(spit[1]) - 1, parseInt(spit[0]));
      }
      else {
        newDate = new Date(this._inputValue.value);
      }

      const maxDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate());
      if (newDate > maxDate) {
        this._inputValue.setValue(undefined);
      }
    }
    if (this.minDate) {
      this.checkMinDate(this.minDate);
      // if (typeof this.minDate == 'string') {
      //   const strMinDate = AppUtilityService.dateToStr(this.minDate).split("/").reverse().join("/");
      //   let newMinDate = new Date(strMinDate);
      //   const strDate = this._inputValue.value.split("/").reverse().join("/");
      //   let newDate = new Date(strDate);
      //   if (newDate < newMinDate) {
      //     this._inputValue.setValue(undefined);
      //   }
      // }
    }
    else {
      let newMinDate = new Date(1900, 0, 1);
      if (this._inputValue.value != null) {
        const strDate = this._inputValue.value.split("/").reverse().join("/");
        let newDate = new Date(strDate);
        if (newDate < newMinDate) {
          this._inputValue.setValue(undefined);
        }
      }
    }
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  mouseLeaveMain() {
    this._isShowIconCalendar = true;
  }

  mouseEnterMain() {
    if (this._inputValue.value) {
      this._isShowIconCalendar = false;
    } else {
      this._isShowIconCalendar = true;
    }
  }

  constructor() { }

  ngAfterViewInit(): void {
    // fromEvent<any>(this.refInput.nativeElement, 'click')
    //     .pipe(
    //         debounceTime(400),
    //         takeUntil(this.$destroy),
    //     ).subscribe(() => {
    //         this.onInputClick();
    //     });

    if (this.isIcon == true) {
      fromEvent<any>(this.oraCalendar.nativeElement, 'click')
        .pipe(
          debounceTime(400),
          takeUntil(this.$destroy),
        ).subscribe(() => {
          this.onInputClick();
        });
    }


    fromEvent<any>($('app-root'), 'click')
      .pipe(
        debounceTime(0),
        takeUntil(this.$destroy),
      ).subscribe(() => {
        //this.refDate.picker.hideOverlay();
        this.refDate.nzOpen = false;
      });
    // fromEvent < any > (document, 'keydown')
    //   .pipe(
    //     debounceTime(0),
    //     takeUntil(this.$destroy),
    //   ).subscribe((event) => {
    //     console.log(event.code, 'event.code');
    //     if (event.code == "Tab") {
    //       this.refDate.picker.hideOverlay();
    //       this.refDate.nzOpen = false;
    //     }
    //   });
    fromEvent<any>($('nz-modal-container'), 'click')
      .pipe(
        debounceTime(0),
        takeUntil(this.$destroy),
      ).subscribe(() => {
        //this.refDate.picker.hideOverlay();
        this.refDate.nzOpen = false;
      });
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
          this._inputValue.setValue(valueText);
        }
        if (result) {
          let localISOResult = _.clone(result);
          localISOResult.setHours(0);
          this.onChangeValue(new Date(localISOResult.toLocalISOString()));
        }
        else {
          this.onChangeValue(result);
        }

      }
    });
    this._inputValue.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100)).subscribe((result) => {
      try {
        const arrStr = result.split('/');
        if (!isNaN(arrStr[0]) && !isNaN(arrStr[1]) && !isNaN(arrStr[2])) {
          const date = moment(result, 'DD/MM/YYYY');
          if (date.isValid()) {
            if (typeof this.disabledDate === 'function') {
              if (this.disabledDate(date.toDate())) {
                this._inputValue.setValue(null);
              } else {
                this.control.setValue(date.toDate());
                //this.refDate.picker.hideOverlay();
                this.refDate.nzOpen = false;
              }
            } else {
              this.control.setValue(date.toDate());
              //this.refDate.picker.hideOverlay();
              this.refDate.nzOpen = false;
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
      this._inputValue.setValue(valueText);
      this.value = moment(obj).toDate();
    } else {
      this._inputValue.setValue('');
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
      this._inputValue.setValue(null);
    }
  }

  onInputClick() {
    //this.refDate.picker.showOverlay();
    this.refDate.nzOpen = true;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.refInput.nativeElement.focus();
      fromEvent<any>($('.ant-picker-cell-selected, .ant-picker-today-btn'), 'click')
        .pipe(
          debounceTime(0),
          takeUntil(this.$destroy),
        ).subscribe(() => {
          //this.refDate.picker.hideOverlay();
          this.refDate.nzOpen = false;
        });
    }, 0);

  }

  onClearClick() {
    this._inputValue.setValue(undefined);
    this._isShowIconCalendar = true;
  }
  disabledDates = (current: Date): boolean => {

    let maxDate = new Date(this.maxDate);
    let minDate = this.minDate != null ? new Date(this.minDate) : new Date(1900, 0, 1);
    let check = false;
    if (minDate) {
      check = check || differenceInCalendarDays(current, minDate) < 0;
    }
    if (this.maxDate) {
      check = check || differenceInCalendarDays(current, maxDate) > 0;
    }
    return check;
  };
}
