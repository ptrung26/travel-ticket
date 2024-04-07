import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Provider, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import * as moment from 'moment';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OrdDatePickerYearComponent),
  multi: true,
};

@Component({
  selector: 'ord-date-picker-year',
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
        (ngModelChange)="onChangeDate($event)"
        [formControl]="control"
        nzMode="year"
        nzFormat="yyyy"
      ></nz-date-picker>
      <input #refInput class="ora-input-date" nz-input [placeholder]="placeHolder" [formControl]="inputValue" [textMask]="{ mask: mask }" />
      <i class="ora-close" *ngIf="isShowIconCalendar === false && disabled !== true" (click)="onClearClick()" nz-icon nzType="close-circle" nzTheme="outline"></i>
      <i class="ora-calendar" *ngIf="isShowIconCalendar || disabled === true" (click)="refDate.picker.showOverlay()" nz-icon nzType="calendar" nzTheme="outline"></i>
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
export class OrdDatePickerYearComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('refDate') refDate: NzDatePickerComponent;
  @ViewChild('refInput') refInput: ElementRef;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() placeHolder = 'Năm';
  mask = [/\d/, /\d/, /\d/, /\d/];
  $destroy: Subject<boolean> = new Subject<boolean>();
  isWriteValue = false;
  @Output() changeDate = new EventEmitter();

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

  @Input() control = new FormControl({ value: '', disabled: true });
  inputValue: FormControl = new FormControl({ value: '', disabled: false });

  private onChange = (v: any) => { };
  private onTouched = () => { };

  onChangeValue(event: any): void {
    this.onChange(event);
  }
  onChangeDate(event: any) {
    this.changeDate.emit(event);
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  mouseLeaveMain() {
    this.isShowIconCalendar = true;
  }

  mouseEnterMain() {
    if (this.inputValue.value) {
      this.isShowIconCalendar = false;
    } else {
      this.isShowIconCalendar = true;
    }
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
    }, 0);
  }

  onClearClick() {
    this.inputValue.setValue(undefined);
    this.isShowIconCalendar = true;
    this.changeDate.emit(null);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged()).subscribe((result: Date) => {
      if (this.isWriteValue) {
        if (result) {
          const valueText = moment(result).format('YYYY');
          this.inputValue.setValue(valueText);
        }

        this.onChangeValue(result);
      }
    });
    this.inputValue.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100)).subscribe((result) => {
      try {
        const arrStr = result.split('_');
        if (arrStr.length == 1) {
          const date = moment(result, 'YYYY');
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
        }
      } catch (e) {
        this.control.setValue(null);
      }
    });
  }

  //#region base ControlValueAccessor
  writeValue(obj: any): void {
    this.value = obj;
    if (obj) {
      const valueText = moment(obj).format('YYYY');
      this.inputValue.setValue(valueText);
    } else {
      this.inputValue.setValue('');
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
}
