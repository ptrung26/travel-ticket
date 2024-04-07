import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, Provider, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
//import { BaseComboBoxComponent } from '../base/base-combo-box.component';
import { RestService } from '@abp/ng.core';

import { ComboBoxComponentBase } from '@app/routes/form-builder/_subs/combo-box/base-combo-box.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputTimePickerComponent),
  multi: true,
};

@Component({
  selector: 'input-time-picker',
  template: `
    <!-- <input nz-input [(ngModel)]="_value" (ngModelChange)="onChangeValue($event)" atp-time-picker [disabled]="sDisabled" /> -->
    <nz-time-picker
      style="width: 100%"
      [(ngModel)]="_value"
      (ngModelChange)="onChangeValue($event)"
      name="fieldName"
      ngDefaultControl
      nzFormat="HH:mm"
    ></nz-time-picker>
  `,
  styles: [
    `
      .ant-select,
      .ant-select-multiple .ant-select-selector {
        height: auto !important;
      }
    `,
  ],
  providers: [VALUE_ACCESSOR],
  // providers: [{
  //   provide: NG_VALUE_ACCESSOR,
  //   useExisting: forwardRef(() => InputTimePickerComponent),
  //   multi: true,
  // },],
})
export class InputTimePickerComponent extends ComboBoxComponentBase implements OnInit, OnChanges, ControlValueAccessor {
  @Input() maxTime: string = '';
  @Output() maxTimeChange = new EventEmitter();
  @Input() minTime: string = '';
  @Output() minTimeChange = new EventEmitter();
  @Input() sDisabled: boolean = false;

  @Output() eventChange = new EventEmitter();
  constructor(private _httpClient: HttpClient, private restService: RestService) {
    super();
  }

  ngOnInit() {
    if (this.isMulti) {
      this.nzMode = 'multiple';
    }
    if (AppUtilityService.isNullOrEmpty(this.placeHolder)) {
      this.placeHolder = 'Chọn...';
    }
  }

  ngAfterViewInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.maxTime) {
      if (changes.maxTime.currentValue != null && this._value != null) {
        // let time1 = Date.parse('1/1/1999 ' + this._value);
        // let time2 = Date.parse('1/1/1999 ' + changes.maxTime.currentValue);
        const time1 = this._value;
        const time2 = changes.maxTime.currentValue;
        if (time1 > time2) {
          this.maxTime = null;
          this.maxTimeChange.emit(this.maxTime);
        }
      }
    }
    if (changes.minTime) {
      if (changes.minTime.currentValue != null && this._value != null) {
        // let time1 = Date.parse('1/1/1999 ' + this._value);
        // let time2 = Date.parse('1/1/1999 ' + changes.minTime.currentValue);
        const time1 = this._value;
        const time2 = changes.minTime.currentValue;
        if (time1 < time2) {
          this.minTime = null;
          this.minTimeChange.emit(this.minTime);
        }
      }
    }
  }

  setValueChange(event) {
    this._value = event;
    this.onChangeValue(event);
  }

  onChangeValue(event) {
    this.onChange(event);
  }
}
