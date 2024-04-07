import { Component, Input, OnInit, ViewChild } from '@angular/core';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { OrdFormItem } from '../../dynamic-form/dynamic-form-page.component';
import { OrdDatePickerComponent } from '../ord-date-picker.component';

@Component({
  selector: 'ord-base-control-date-month-picker',
  template: `
    <ord-date-picker-month
      #vcDatePicker
      [(ngModel)]="dataForm[control.dataField]"
      *ngIf="!control.disabled"
      (ngModelChange)="onChangeFormItem()"
      [disabled]="control.disabled"
      [disabledDate]="disabledDate"
    ></ord-date-picker-month>
    <input *ngIf="control.disabled" placeholder="Tháng/Năm" nz-input [nzSize]="control.size" value="{{ dataForm[control.dataField] | date: 'MM/yyyy' }}" [disabled]="true" />
  `,
})
export class DateMonthPickerControlComponent implements OnInit {
  @ViewChild('vcDatePicker') vcDatePicker: OrdDatePickerComponent;
  @Input() dataForm = {};
  @Input() control: OrdFormItem;
  @Input() allControls: OrdFormItem[] = [];
  minDate: Date;
  maxDate: Date;

  ngOnInit(): void {
    if (this.control && !AppUtilityService.isNullOrEmpty(this.control.abpEventKey)) {
      const abpKey = this.control.abpEventKey;
      if (AppUtilityService.isNullOrEmpty(abpKey.changeDateMin) === false) {
        ora.event.on(abpKey.changeDateMin, (mindate) => {
          this.minDate = mindate;
        });
      }
      if (AppUtilityService.isNullOrEmpty(abpKey.changeDateMax) === false) {
        ora.event.on(abpKey.changeDateMax, (maxDate) => {
          this.maxDate = maxDate;
        });
      }
    }
  }

  onChangeFormItem() {
    if (this.control.handlerOnChange) {
      this.control.handlerOnChange(this.dataForm, this.allControls);
    }
  }

  disabledDate = (current: Date): boolean => {
    const dateOpt = this.control?.option?.dateOpt;
    if (dateOpt) {
      this.minDate = dateOpt?.min;
      this.maxDate = dateOpt?.max;
    }

    if (this.control.dateNotGreaterThanCurrent && !this.maxDate) {
      this.maxDate = new Date();
    }
    let check = false;
    if (this.minDate) {
      check = check || differenceInCalendarDays(current, this.minDate) < 0;
    }
    if (this.maxDate) {
      check = check || differenceInCalendarDays(current, this.maxDate) > 0;
    }
    return check;
  };
}
