import {
  Injector
} from '@angular/core';
import {
  SubscriptionService
} from '@node_modules/@abp/ng.core';
import {
  Select,
  Store
} from '@node_modules/@ngxs/store';
import {
  NzModalService
} from '@node_modules/ng-zorro-antd/modal';
import {
  NzDrawerService
} from '@node_modules/ng-zorro-antd/drawer';

import {
  Observable
} from 'rxjs';
import {
  takeUntil
} from 'rxjs/operators';
import {
  DestroyRxjsService
} from './destroy-rxjs.service';
import { differenceInCalendarDays } from 'date-fns';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

export abstract class AppMainComponentBase {
  protected constructor(injector: Injector) {

  }
  toDay = new Date();
  flattenDeep(array) {
    return array.reduce((acc, val) =>
      Array.isArray(val) ?
        acc.concat(this.flattenDeep(val)) :
        acc.concat(val),
      []);
  }

  trackByFn(index, item) {
    return index;
  }

  getWidthMobile(widthMobile: number, widthDeskop?: number) {
    let screen = $(document).width();
    if (screen <= 1280) {
      return widthMobile;
    }
    return widthDeskop;
  }

  getWidthScreen() {
    let screen = $(document).width();
    return screen;
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.toDay) > 0;
  };

  autoFormatName(str: string) {
    let arrChars = str.toLowerCase().split(' ');
    let strNew = ''
    arrChars.forEach(item => {
      if (!AppUtilityService.isNullOrWhiteSpace(item)) {
        strNew += (item + ' ');
      }
    });
    strNew = strNew.substring(0, strNew.length - 1);
    str = strNew.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
    return str;
  }
  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
