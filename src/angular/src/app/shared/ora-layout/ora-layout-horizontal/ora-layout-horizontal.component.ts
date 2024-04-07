import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@node_modules/@angular/router';
import { LayoutDefaultOptions } from '@node_modules/@delon/theme/layout-default';
import { NzMessageService } from '@node_modules/ng-zorro-antd/message';
import { Subject } from '@node_modules/rxjs';
import { takeUntil } from '@node_modules/rxjs/internal/operators';
import {
  ApplicationConfigurationDto,
  CurrentUserDto,
  OrdApplicationConfigurationServiceProxy,
} from '@service-proxies/danh-muc-service-proxies';
import { ILayoutMenu } from '@shared/ora-layout/ora-layout-horizontal/menu-defines/interface-layout-menu';
import * as Menus from './menu-defines';

@Component({
  selector: 'ora-layout-horizontal',
  templateUrl: './ora-layout-horizontal.component.html',
  styleUrls: ['./ora-layout-horizontal.component.scss'],
})
export class OraLayoutHorizontalComponent implements OnInit, OnDestroy {
  @Input() content: TemplateRef<void>;
  @Input() rightContent: TemplateRef<void>;
  @Input() options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo.png`,
    logoCollapsed: `./assets/logo-col.png`,
    hideAside: false,
  };

  currentUser: CurrentUserDto;
  $destroy = new Subject<boolean>();
  isFetching = false;
  isPhongXetNghiemOrBenhVien = false;
  permissionUser = [];

  menusCongViec = [];
  menusDM = [];
  menusQT = [];

  constructor(msgSrv: NzMessageService, private _ordApplicationService: OrdApplicationConfigurationServiceProxy, private router: Router) {
    this.router.events.pipe(takeUntil(this.$destroy)).subscribe((evt) => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          msgSrv.error(`Could not load ${evt.url} route`, { nzDuration: 1000 * 3 });
        }
        return;
      }
      if (!(evt instanceof NavigationEnd || evt instanceof RouteConfigLoadEnd)) {
        return;
      }
      if (this.isFetching) {
        setTimeout(() => {
          this.isFetching = false;
        }, 100);
      }
    });
  }

  ngOnInit(): void {
    this.getAllPermisionUser();
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  getAllPermisionUser() {
    this._ordApplicationService.getConfiguration().subscribe((res: ApplicationConfigurationDto) => {
      this.permissionUser = Object.keys(res.auth.grantedPolicies);
      this.isPhongXetNghiemOrBenhVien = res.currentUser?.roles.some((x) => x.toLowerCase() === 'benhvien' || x.toLowerCase() === 'kpxn');
      this.currentUser = res.currentUser;
      this.addMenu();
    });
  }

  addMenu() {
    //Công việc
    this.menusCongViec = this.getMenus([Menus.LayoutMenuCV]).menu;

    //Danh mục
    this.menusDM = this.getMenus([Menus.LayoutMenuDM]).menu;

    //Quản trị
    this.menusQT = this.getMenus([Menus.LayoutMenuQT]).menu;

  }

  //#region đừng có mà động vào
  getMenus(menuFilter) {
    let menuResult = [];
    menuFilter.forEach((menu) => {
      let menuLoop = [];
      menuResult = [...menuResult, this.filterMenu(menu, menuLoop)];
    });
    menuResult = menuResult?.filter((x) => !!x?.length);
    return {
      menu: menuResult,
    };
  }

  checkPermission(menu: ILayoutMenu): boolean {
    if (menu?.permission && !this.permissionUser.some((p) => p === menu.permission)) {
      // menu parent not permission
      if (menu?.children?.length) {
        //check permission child

        //not any child have permission
        if (!menu?.children?.some((x) => this.permissionUser.some((p) => p === x.permission))) {
          return false;
        }
      } else {
        return false;
      }
    } else if (!menu?.permission) {
      if (!menu?.children?.some((x) => this.permissionUser.some((p) => p === x.permission))) {
        return false;
      }
    }

    return true;
  }

  filterMenu(menus: ILayoutMenu[], menusFilter: ILayoutMenu[]) {
    menus?.forEach((menu) => {
      if (this.checkPermission(menu)) {
        let addMenu: ILayoutMenu = {
          text: menu.text,
          link: menu.link,
          level: menu.level,
          permission: menu.permission,
          children: [],
        };
        if (menu?.children) {
          this.filterMenuChild(menu?.children, addMenu);
        }
        menusFilter.push(addMenu);
      }
    });

    return menusFilter;
  }

  filterMenuChild(menusChild: ILayoutMenu[], menuFilter: ILayoutMenu) {
    menusChild?.forEach((menuC) => {
      if (this.checkPermission(menuC)) {
        if (this.isPhongXetNghiemOrBenhVien) {
          this.renameMenu(menuC);
        }
        menuFilter?.children.push(menuC);
      }
    });
  }

  renameMenu(menu: ILayoutMenu) {
    if (menu.link === '/ho-tro/khach-hang-khao-sat') {
      menu.text = 'Tham gia khảo sát';
    }
  }
  //#endregion
}
