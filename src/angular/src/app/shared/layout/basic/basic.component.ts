import { Component, Injector, OnInit } from '@angular/core';
import {
  PagingSysNotificationsRequest,
  SysNotificationsDto,
  SysNotificationsServiceProxy,
  UserSessionDto,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
// import { environment } from '@env/environment';
import { Observable, from } from 'rxjs';
import { finalize, take, toArray } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import * as Menus from '../../ora-layout/ora-layout-horizontal/menu-defines';
import { MenuService } from '@node_modules/@delon/theme';
import _ from 'lodash';
import { DestroyRxjsService } from '../../../../shared/destroy-rxjs.service';
import { SubscriptionService } from '@abp/ng.core';
import { Select, Store } from '@ngxs/store';
import { AppSessionState } from '@app/stores/app-session/state';

@Component({
  selector: 'layout-basic',
  styleUrls: ['./basic.scss'],
  templateUrl: './basic.component.html',
  providers: [DestroyRxjsService, SubscriptionService],
})
export class LayoutBasicComponent extends AppComponentBase implements OnInit {
  sessionUser: any = {};
  @Select(AppSessionState.userSession) userSession$: Observable<any>;
  counterNoti = 0;
  options: LayoutDefaultOptions = {
    // logoExpanded: `./assets/logo/logo.png`,
    logoExpanded: "",
    logoCollapsed: `./assets/logo/logo-col.png`,
  };
  searchToggleStatus = true;
  numberIsNotReadNotifications = 0;
  sysNotificationsView: SysNotificationsDto[] = [];
  isAdmin: boolean = false;

  constructor(
    injector: Injector,
    private ngAlainMenuService: MenuService,
    private _sysNotificationsService: SysNotificationsServiceProxy,
    private d$: DestroyRxjsService,
    private store: Store
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.ngAlainMenuService.add(this.getMenus());
    this.userSession = JSON.parse(sessionStorage.getItem('userSession'));
    this.store.selectOnce(AppSessionState.userSession).subscribe(userSession => {
      if (userSession) {
        this.checkRole(userSession)
      }
    });
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

  }

  getMenus() {
    return _.flattenDeep([...Menus.LayoutMenuQT, ...Menus.LayoutMenuDM, ...Menus.LayoutmenuSP, ...Menus.LayoutMenuKhachHang, ...Menus.LayoutMenuBooking]);
  }

  checkRole(userSession: UserSessionDto) {
    if (userSession && !userSession.sysUserId) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
}
