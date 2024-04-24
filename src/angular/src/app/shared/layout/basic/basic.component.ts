import { Component, Injector, OnInit } from '@angular/core';
import {
  PagingSysNotificationsRequest,
  SysNotificationsDto,
  SysNotificationsServiceProxy,
  UserSessionDto,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
// import { environment } from '@env/environment';
import { from } from 'rxjs';
import { finalize, take, toArray } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import * as Menus from '../../ora-layout/ora-layout-horizontal/menu-defines';
import { MenuService } from '@node_modules/@delon/theme';
import _ from 'lodash';
import { DestroyRxjsService } from '../../../../shared/destroy-rxjs.service';
import { SubscriptionService } from '@abp/ng.core';

@Component({
  selector: 'layout-basic',
  styleUrls: ['./basic.scss'],
  templateUrl: './basic.component.html',
  providers: [DestroyRxjsService, SubscriptionService],
})
export class LayoutBasicComponent extends AppComponentBase implements OnInit {
  sessionUser: any = {};
  userSession: UserSessionDto;
  counterNoti = 0;
  options: LayoutDefaultOptions = {
    // logoExpanded: `./assets/logo/logo.png`,
    logoExpanded: "",
    logoCollapsed: `./assets/logo/logo-col.png`,
  };
  searchToggleStatus = true;
  numberIsNotReadNotifications = 0;
  sysNotificationsView: SysNotificationsDto[] = [];

  constructor(
    injector: Injector,
    private ngAlainMenuService: MenuService,
    private _sysNotificationsService: SysNotificationsServiceProxy,
    private d$: DestroyRxjsService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // this.navService.mapToNgAlainMenu();
    this.ngAlainMenuService.add(this.getMenus());
    this.userSession = JSON.parse(sessionStorage.getItem('userSession'));

    const input: PagingSysNotificationsRequest = new PagingSysNotificationsRequest();
    input.maxResultCount = 1000;
    this._sysNotificationsService
      .getlist(input)
      .pipe()
      .subscribe((result) => {
        this.numberIsNotReadNotifications = result.items.filter((x) => !x.isState)?.length;
        from(result.items)
          .pipe(take(3), toArray())
          .subscribe((res) => {
            this.sysNotificationsView = res;
          });
      });
    // ora.event.on('refreshBellNotiKhaoSat', (e) => {
    //   this.checkNoti();
    // })
  }

  getMenus() {
    return _.flattenDeep([...Menus.LayoutMenuCV, ...Menus.LayoutMenuDM]);
  }
}
