import { AfterViewInit, Component, DoCheck, EventEmitter, Input, KeyValueDiffer, KeyValueDiffers, OnInit, Output } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { Subject } from '@node_modules/rxjs';
import { debounceTime, takeUntil } from '@node_modules/rxjs/internal/operators';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { OrdFormItem } from './dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

export interface OrdCustomnValidate {
  type?: 'email' | 'phone' | 'password' | 'custom' | 'soduong';
  funcCheck?: any;
  errMessage?: string;
}

@Component({
  selector: 'validate-ord-dynamic-form',
  template: '',
  providers: [
    DestroyRxjsService
  ]
})
export class ValidateDynamicFormComponent implements DoCheck, AfterViewInit, OnInit {
  @Input() dataForm: any = {};
  @Output() dataFormChange = new EventEmitter();
  @Input() listOfFormItems: OrdFormItem[] = [];
  @Input() focusFirstItem = true;
  @Input() keyControlElementId = Number(new Date());
  @Input() submitted = false;
  @Output() submittedChange = new EventEmitter();
  errEmpty = 'Không để trống trường này!';
  private differ: KeyValueDiffer<string, any>;
  private isValid = false;
  private isFocus = false;
  private submitting = true;
  private changeData$ = new Subject();

  constructor(private differs: KeyValueDiffers,
    private destroy$: DestroyRxjsService) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.changeData$.pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(666))
      .subscribe((data) => {
        this.validateForm();
        this.dataFormChange.emit(data);
      });
  }

  ngDoCheck(): void {
    if (this.differ.diff(this.dataForm)) {
      this.changeData$.next(this.dataForm);
    }
  }

  ngAfterViewInit(): void {
    // focus form đầu tiên
    if (this.focusFirstItem === true) {
      this.onFocusFirstFormItem();
    }
  }

  validateForm() {
    if (this.submitted === false) {
      return false;
    }
    this.isValid = true;
    this.isFocus = false;
    this.listOfFormItems.forEach((item) => {
      item.message = '';
      if (AppUtilityService.isNotNull(item.funcShow) && item.funcShow(this.dataForm) !== true) {
        return false;
      }
      this.checkNull(item);
      if (item.message !== '') {
        return false;
      }
      this.checkListCustomValidate(item);
    });
  }

  checkNull(item: OrdFormItem) {
    if (item?.ignoreCheckNull) {
      return;
    }
    if (item?.required) {
      this.checkValueNullOrEmpty(this.dataForm[item.dataField], item);
      // if (Array.isArray(item.dataField)) {
      //   _.forEach(item.dataField, (df) => {
      //     this.checkValueNullOrEmpty(this.dataForm[df], item);
      //   });
      // } else {
      //
      // }
    }
  }

  checkValueNullOrEmpty(data, item: OrdFormItem) {
    const errEmpty = AppUtilityService.isNullOrEmpty(item.errEmpty) ? this.errEmpty : item.errEmpty;
    if (AppUtilityService.isNullOrEmpty(data)) {
      item.message = errEmpty;
      this.setNotValid(item);
      return;
    }
    const isWhiteSpace = ('' + (data || '')).trim().length === 0;
    if (isWhiteSpace) {
      item.message = errEmpty;
      this.setNotValid(item);
      return;
    }
  }

  checkListCustomValidate(item: OrdFormItem) {
    const data = this.dataForm[item.dataField];
    if (item.validate && item.validate.length > 0) {
      _.forEach(item.validate, (v) => {
        if (v.type === 'email') {
          if (!AppUtilityService.isNullOrEmpty(data)) {
            if (this.checkEmail(data) === false) {
              item.message = 'Email không đúng định dạng!';
              this.setNotValid(item);
              return false;
            }
          }
        }
        if (v.type === 'password' && this.checkPassword(data) === false) {
          item.message = 'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ và số!';
          this.setNotValid(item);
          return false;
        }
        if (v.type === 'phone' && this.checkPhone(data) === false) {
          item.message = 'Số điện thoại không đúng định dạng!';
          this.setNotValid(item);
          return false;
        }
        // validate custom dựa vào kết quả trả ra của hàm funcCheck dc định nghĩa
        if (v.type === 'custom') {
          if (v.funcCheck && v.funcCheck(this.dataForm)) {
            item.message = v.errMessage;
            this.setNotValid(item);
            return false;
          }
        }

        if (v.type === 'soduong' && this.checkSoDuong(data) === false) {
          item.message = 'Giá trị không hợp lệ!';
          this.setNotValid(item);
          return false;
        }
      });
    }
  }

  setNotValid(control: OrdFormItem) {
    this.isValid = false;
    if (this.submitting === false) {
      return;
    }
    if (this.isFocus === false) {
      this.focusControlItem(control);
    }
  }

  focusControlItem(control: OrdFormItem) {
    const idEle = '#' + this.renderElementId(control);
    if (control.type === 'check-box') {
      return;
    }
    this.isFocus = true;
    $(idEle).find('.ord-dynamic-input').focus();
    $(idEle).find('.ant-input-number-input').focus();
    $(idEle).find('.ant-input').focus();
    $(idEle).find('.ant-select-selection-search-input').focus();
    if ($(idEle).find('.ant-radio-input')[0]) {
      $(idEle).find('.ant-radio-input')[0].focus();
    }
  }

  checkEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  checkPassword(value: string) {
    const check = value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/);
    return !!check;
  }

  checkPhone(value: string) {
    const check = value.match(/(09|01[2|6|8|9])+([0-9]{8})\b/);
    return !!check;
  }

  checkSoDuong(value: number) {
    return +value > 0;
  }

  renderElementId(control) {
    return `${this.keyControlElementId}_${control.dataField}`;
  }


  onFocusFirstFormItem() {
    if (this.listOfFormItems) {
      _.forEach(this.listOfFormItems, (it) => {
        if (it.disabled !== true) {
          setTimeout(() => {
            this.focusControlItem(it);
          });
          return false;
        }
      });
    }
  }

  // validate và lấy giá trị form
  getDataForm() {
    this.submitted = true;
    this.submittedChange.emit(true);
    this.submitting = true;
    this.validateForm();
    this.submitting = false;
    if (this.isValid === true) {
      return this.dataForm;
    }
    return null;
  }
}
