import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Provider } from '@angular/core';
import { Subject } from 'rxjs';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import endOfMonth from 'date-fns/endOfMonth';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OrdDataPickerRangeComponent),
  multi: true
};

@Component({
  selector: 'ord-date-picker-range',
  template: `
      <nz-range-picker style="width:100%" [nzRanges]="ranges" [(ngModel)]="this.dataForm[this.control2.dataField]" (ngModelChange)="onChangeDate($event)" [formControl]="control"
                       [nzDisabled]="disabled" [nzFormat]="dateFormat"></nz-range-picker>
  `,
  providers: [VALUE_ACCESSOR]
})
export class OrdDataPickerRangeComponent implements OnInit, ControlValueAccessor, OnDestroy {
  ranges = { 'Hôm nay': [new Date(), new Date()], 'Tháng này': [new Date(), endOfMonth(new Date())] };
  $destroy: Subject<boolean> = new Subject<boolean>();
  isWriteValue = false;
  @Input() disabled?: (d: Date) => boolean;
  @Output() changeDate = new EventEmitter();
  @Input() dataForm = {};
  @Input() control2: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  dateFormat = 'dd/MM/yyyy';
  get value() {
    return this.control.value;
  }

  set value(v: any) {
    this.control.setValue(v);
  }

  @Input() control = new FormControl({ value: '', disabled: false });
  inputValue: FormControl = new FormControl({ value: '', disabled: false });

  private onChange = (v: any) => {
  }
  private onTouched = () => {
  }

  onChangeValue(event: any): void {
    this.onChange(event);

  }

  onChangeDate(event: any) {
    this.changeDate.emit(event);
  }

  constructor() {
  }

  onClearClick() {
    this.inputValue.setValue(undefined);
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
          const valueText = moment(result).format('DD/MM/YYYY');
          this.inputValue.setValue(valueText);
        }
        this.onChangeValue(result);
      }

    });
  }

  //#region base ControlValueAccessor
  writeValue(obj: any): void {
    this.value = obj;
    if (obj) {
      const valueText = moment(obj).format('DD/MM/YYYY');
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

  //#endregion
}
