import { Injector } from '@angular/core';
import { PermissionService } from '@node_modules/@abp/ng.core';
import { ReuseTabService } from '@node_modules/@delon/abc/reuse-tab';
import { ModalHelper, TitleService } from '@node_modules/@delon/theme';
import { TranslateService } from '@node_modules/@ngx-translate/core';
import { UserSessionDto } from '../service-proxies/tai-khoan-service-proxies';
import { ComboBoxEnumCode } from './AppConsts';

export abstract class AppComponentBase {
  modalHelper: ModalHelper;
  userSession: UserSessionDto;
  ComboBoxEnumCode = ComboBoxEnumCode;
  protected reuseTabService: ReuseTabService;
  private permissionService: PermissionService;
  private titleSrv: TitleService;
  private tranSrv: TranslateService;

  protected constructor(injector: Injector) {
    this.modalHelper = injector.get(ModalHelper);
    this.reuseTabService = injector.get(ReuseTabService);
    this.permissionService = injector.get(PermissionService);
    this.titleSrv = injector.get(TitleService);
    this.tranSrv = injector.get(TranslateService);
  }

  formatterNumber = (value: any) => {
    if (value) {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
    }
  };
  parserNumber = value => value.replace(/\$\s?|(,*)/g, '');

  setTitleTab(title: string) {
    this.reuseTabService.title = title;
    this.titleSrv.setTitle(title);
  }

  l(value: string, params?: any) {
    return this.tranSrv.instant(value, params);
  }

  isGranted(permissionName: string): boolean {
    return this.permissionService.getGrantedPolicy(permissionName);
    // return true; //this.permission.isGranted(permissionName);
  }

  closeReutabActive(url: string) {
    setTimeout(() => {
      this.reuseTabService.close(url);
    });
  }
}
