import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

import { TYPE_VALIDATE } from '../AppEnums';

export interface commonResultValidDto {
  isError: boolean;
  messages: string;
}

@Component({
  selector: '<validation-custom>',
  template: ` <span
    #mySpan
    class="form-control-feedback"
    class="{{ isHidden ? '' : 'custom-error-validate' }} {{ isInvalidData ? 'invalid-data-form' : '' }}"
    style="display: none;"
    [hidden]="isHidden"
  >
    {{ messages }}
  </span>`,
})
export class ValidationCustomComponent implements OnChanges, AfterViewInit {
  @ViewChild('mySpan') _mySpan: ElementRef;

  @Input() sModel: any;
  @Input() equalsModel: any;
  @Input() sMaxLength: number;
  @Input() sMinLength: number;
  @Input() sEqualLength: number;
  @Input() arrDataDuplicates: any;
  @Input() sValidRef: commonResultValidDto;
  @Input() sType: TYPE_VALIDATE;
  @Input() messagesInput: string;
  @Input() isNotValidateNullOrEmpty: boolean;
  @Input() nativeElement: any;
  @Input() bindingModel: any;
  @Input() maxValue: any;
  @Input() minValue: any;
  @Input() isFullHour: boolean;
  messages: string = '';
  isInvalidData: boolean = false;
  isHidden: boolean = false;
  isAfterViewInit: boolean = false;

  checkHidden(): void {
    this.messages = AppUtilityService.isNullOrWhiteSpace(this.messagesInput) ? 'Không được để trống trường này' : this.messagesInput;

    this.isHidden = true;
    this.isInvalidData = false;

    // console.log(this.sModel);
    // console.log(!this.sModel);
    // var x = AppUtilityService.isNullOrWhiteSpace(this.sModel);
    // console.log(x);
    // console.log(!(this.sType == TYPE_VALIDATE.Datetime));
    // console.log(!this.sModel?.length);
    // console.log(!isNaN(this.sModel));
    if (
      (AppUtilityService.isNullOrWhiteSpace(this.sModel) ||
        (!this.sModel && isNaN(this.sModel)) ||
        (!(this.sType == TYPE_VALIDATE.Datetime) && Array.isArray(this.sModel) && !this.sModel?.length)) &&
      typeof this.sModel != 'boolean'
    ) {
      this.isHidden = this.isNotValidateNullOrEmpty;
    } else if (!AppUtilityService.isNullOrWhiteSpace(this.sMaxLength) && this.sModel.length > this.sMaxLength) {
      this.messages = AppUtilityService.isNullOrWhiteSpace(this.messagesInput)
        ? 'Dữ liệu không thể vượt quá ' + this.sMaxLength + ' kí tự'
        : this.messagesInput;
      this.isHidden = false;
    } else if (!AppUtilityService.isNullOrWhiteSpace(this.sMinLength) && this.sModel.length < this.sMinLength) {
      this.messages = AppUtilityService.isNullOrWhiteSpace(this.messagesInput)
        ? 'Dữ liệu nhập tối thiểu ' + this.sMinLength + ' kí tự'
        : this.messagesInput;
      this.isHidden = false;
    } else if (!AppUtilityService.isNullOrWhiteSpace(this.sEqualLength) && this.sModel.length != this.sEqualLength) {
      this.messages = AppUtilityService.isNullOrWhiteSpace(this.messagesInput)
        ? 'Dữ liệu nhập phải = ' + this.sEqualLength + ' kí tự'
        : this.messagesInput;
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.Number && !AppUtilityService.validateNumber(this.sModel)) {
      this.messages = 'Kí tự không đúng định dạng';
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.CCCD && !AppUtilityService.validateNumberCCCD(this.sModel)) {
      this.messages = 'Số CMND/CCCD 9-12 số';
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.Email && !AppUtilityService.validateEmail(this.sModel)) {
      this.messages = 'Email không đúng định dạng';
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.Moment && !AppUtilityService.validateMoment(this.sModel)) {
      this.messages = 'Nhập ngày/tháng/năm';
      this.isHidden = false;
    } else if (
      this.sType == TYPE_VALIDATE.Datetime &&
      this.maxValue &&
      AppUtilityService.compareDatetime(this.sModel, this.maxValue, this.isFullHour) > 0
    ) {
      let maxDate = new Date(this.maxValue);
      this.messages =
        'Ngày nhập phải nhỏ hơn hoặc bằng ' +
        (this.isFullHour
          ? moment(maxDate).format('DD/MM/YYYY HH:mm')
          : maxDate.getDate() + '/' + (maxDate.getMonth() + 1) + '/' + maxDate.getFullYear());
      this.isHidden = false;
    } else if (
      this.sType == TYPE_VALIDATE.Datetime &&
      this.minValue &&
      AppUtilityService.compareDatetime(this.sModel, this.minValue, this.isFullHour) < 0
    ) {
      let minDate = new Date(this.minValue);
      this.messages =
        'Ngày nhập phải lớn hơn hoặc bằng ' +
        (this.isFullHour
          ? moment(minDate).format('DD/MM/YYYY HH:mm')
          : minDate.getDate() + '/' + (minDate.getMonth() + 1) + '/' + minDate.getFullYear());
      this.isHidden = false;
    } else if (
      this.sType == TYPE_VALIDATE.MinValue &&
      this.sModel != null &&
      this.equalsModel != null &&
      parseInt(this.sModel) < parseInt(this.equalsModel)
    ) {
      this.messages = 'Giá trị nhập < giá trị tối thiểu là: (' + this.equalsModel + ')';
      this.isHidden = false;
    } else if (
      this.sType == TYPE_VALIDATE.MaxValue &&
      this.sModel != null &&
      this.equalsModel != null &&
      parseInt(this.sModel) > parseInt(this.equalsModel)
    ) {
      this.messages = 'Giá trị nhập > giá trị cho phép là: (' + this.equalsModel + ')';
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.PassWord && this.sModel != null && AppUtilityService.validatePassword(this.sModel) === false) {
      this.messages = 'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ và số!';
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.Phone && this.sModel != null && AppUtilityService.validateNumberPhone(this.sModel) === false) {
      this.messages = 'Số điện thoại không đúng định dạng';
      this.isHidden = false;
    } else if (
      this.sType == TYPE_VALIDATE.CheckDuplicates &&
      this.arrDataDuplicates != null &&
      this.arrDataDuplicates.includes(this.sModel)
    ) {
      this.messages = this.messagesInput || 'Giá trị nhập đã tồn tại!';
      this.isInvalidData = true;
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.Dynamic) {
      this.messages = this.messagesInput || 'Giá trị nhập không hợp lệ !';
      this.isInvalidData = true;
      this.isHidden = false;
    } else if (
      this.sType == TYPE_VALIDATE.ValidRef &&
      !AppUtilityService.isNullOrWhiteSpace(this.sModel) &&
      this.sValidRef != null &&
      this.sValidRef.isError
    ) {
      this.messages = this.sValidRef.messages || 'Giá trị không hợp lệ !';
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.Array && !AppUtilityService.isNullOrWhiteSpace(this.sModel) && this.sModel.length == 0) {
      this.messages = this.messagesInput || 'Không được để trống trường này ';
      this.isHidden = false;
    } else if (this.sType == TYPE_VALIDATE.Timer) {
      if (this.maxValue) {
        let maxDate = new Date(this.maxValue);
        if (typeof this.maxValue === 'object' && typeof this.sModel === 'object' && this.maxValue.getTime() - this.sModel.getTime() < 0) {
          this.messages =
            'Giờ nhập phải nhỏ hơn hoặc bằng ' +
            (this.isFullHour
              ? moment(maxDate).format('HH:mm')
              : maxDate.getHours() + ':' + maxDate.getMinutes() + ':' + maxDate.getSeconds());
          this.isHidden = false;
        }
      } else if (this.minValue) {
        let minDate = new Date(this.minValue);
        if (typeof this.maxValue === 'object' && typeof this.sModel === 'object' && this.sModel.getTime() - this.minValue.getTime() < 0) {
          this.messages =
            'Giờ nhập phải lớn hơn hoặc bằng ' +
            (this.isFullHour
              ? moment(minDate).format('HH:mm')
              : minDate.getHours() + ':' + minDate.getMinutes() + ':' + minDate.getSeconds());
          this.isHidden = false;
        }
      }
    }

    if (this.isAfterViewInit && this.nativeElement && this.nativeElement.style) {
      this.nativeElement.style.cssText = this.isHidden ? null : 'color: #fd397a; border: 1px solid #fd397a;';
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.isAfterViewInit) {
      this._mySpan.nativeElement.style.display = 'inline';
    }
    this.checkHidden();
  }

  ngAfterViewInit() {
    this.isAfterViewInit = true;
    if (this.bindingModel) {
      this._mySpan.nativeElement.style.display = 'inline';
      this.checkHidden();
    }
  }
}
