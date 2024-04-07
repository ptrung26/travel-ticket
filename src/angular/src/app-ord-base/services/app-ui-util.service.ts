import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { ModalOptions } from '@node_modules/ng-zorro-antd/modal';

@Injectable()
export class AppUiUtilService {

  static focusControlWhenHasErrorValidate() {
    const contr$ = $('.form-control-err').first().parent();
    contr$.find('.ord-dynamic-input').focus();
    contr$.find('.ant-input-number-input').focus();
    contr$.find('.ant-input').focus();
    contr$.find('.ant-select-selection-search-input').focus();
    if (contr$.find('.ant-radio-input').first()) {
      contr$.find('.ant-radio-input').first().focus();
    }
    // $('html, body').animate({
    //   scrollTop: contr$.offset()?.top - 80
    // });
  }

  static nzConfirmOptions(opt: Partial<ModalOptions>): ModalOptions {
    return {
      nzTitle: 'Xác nhận',
      nzCancelText: 'Không',
      nzOkText: 'Có',
      ...opt
    };

  }
}
