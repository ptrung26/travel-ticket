import { AuthService } from '@node_modules/@abp/ng.core';
import { Injector } from '@node_modules/@angular/core';
import { IconDefinition } from '@node_modules/@ant-design/icons-angular';
import * as AllIcons from '@node_modules/@ant-design/icons-angular/icons';
import { TranslateService } from '@node_modules/@ngx-translate/core';
import { OAuthService } from '@node_modules/angular-oauth2-oidc';
import { NzIconService } from '@node_modules/ng-zorro-antd/icon';
import { NzMessageService } from '@node_modules/ng-zorro-antd/message';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import { NzNotificationService } from '@node_modules/ng-zorro-antd/notification';
import { ICONS } from '../styles/style-icons';
import { ICONS_AUTO } from '../styles/style-icons-auto';
import { OraSpinService } from '@shared/ora-spin/ora-spin.service';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

export class AppPreBootstrap {
  static run(injector: Injector, callback: () => void): void {
    AppPreBootstrap.initNzIcon(injector);
    AppPreBootstrap.initEvent(injector);
    callback();
  }

  private static initNzIcon(injector: Injector) {
    const service = injector.get(NzIconService);
    service.addIcon(...ICONS_AUTO, ...ICONS, ...icons);
  }

  private static initEvent(injector: Injector) {
    const spinner = injector.get(OraSpinService);
    const messageService = injector.get(NzMessageService);
    const notifyService = injector.get(NzNotificationService);
    const modalService = injector.get(NzModalService);
    const tranService = injector.get(TranslateService);

    ora.event.on('ora.ui.setBusy', (d) => {
      spinner.show(d);
    });
    ora.event.on('ora.ui.clearBusy', () => {
      spinner.hide();
    });
    ora.event.on('event.notify.error', (d) => {
      notifyService.error(d.title, d.message, d.options);
    });
    ora.event.on('event.notify.warn', (d) => {
      notifyService.warning(d.title, d.message, d.options);
    });
    ora.event.on('event.notify.info', (d) => {
      notifyService.info(d.title, d.message, d.options);
    });
    ora.event.on('event.notify.success', (d) => {
      notifyService.success(d.title, d.message, d.options);
    });

    ora.event.on('event.message.error', (d) => {
      messageService.error(d.message, d.options);
    });
    ora.event.on('event.message.info', (d) => {
      messageService.info(d.message, d.options);
    });
    ora.event.on('event.message.success', (d) => {
      messageService.success(d.message, d.options);
    });
    ora.event.on('event.message.warn', (d) => {
      messageService.warning(d.message, d.options);
    });
    ora.event.on('event.message.confirm', (d) => {
      // message, title, onOk, onCancel, options, confirmType
      const options = d.options ? d.options : {};
      modalService.confirm(
        {
          nzTitle: d.title,
          nzContent: d.message,
          nzOnOk: d.onOk,
          nzOnCancel: d.onCancel ? d.onCancel : () => {},
          nzOkText: tranService.instant('OkText'),
          nzCancelText: tranService.instant('CancelText'),
          ...options,
        },
        d.confirmType,
      );
    });
    ora.event.on('event.downloadFile', (d) => {
      // message, title, onOk, onCancel, options, confirmType
      const url = d.urlService + '/api/' + d.basePath + '/file/downloadtempfile/' + d.fileToken;
      location.href = url;
      console.log(url);
    });
  }
}
