import { PermissionService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { Menu, MenuService } from '@delon/theme';
import { TranslateService } from '@node_modules/@ngx-translate/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';

@Injectable()
export class AppNavigationService {
  constructor(private ngAlainMenuService: MenuService, private translateService: TranslateService, private permission: PermissionService) {}

  getMenu(): AppMenu {
    return new AppMenu('MainMenu', 'MainMenu', [
      new AppMenuItem('Danh mục', '', 'ora:quan-tri', '/danh-muc/dashboard'),
      new AppMenuItem('Công việc', 'CongViecPermission', 'ora:quan-tri', '/cong-viec/danh-sach', []),
      new AppMenuItem('Quản trị', '', 'ora:quan-tri', '', [
        new AppMenuItem('Vai trò', 'AbpIdentity.Roles', 'ora:dot', '/admin/roles'),
        new AppMenuItem('Người dùng', 'AbpIdentity.Users', 'ora:dot', '/admin/users'),
        new AppMenuItem('Cơ cấu tổ chức', 'AbpIdentity.OrganizationUnits', 'ora:dot', '/admin/organization-units'),
        new AppMenuItem('Cấu hình hệ thống', 'AbpIdentity.SettingManagement', 'ora:dot', '/admin/setting-management'),
      ]),
    ]);
  }

  mapToNgAlainMenu(): void {
    let ngAlainRootMenu: Menu;
    const menu = this.getMenu();
    ngAlainRootMenu = {
      text: menu.name,
      group: false,
      hideInBreadcrumb: true,
      children: [],
    } as Menu;
    this.generateNgAlainMenus(ngAlainRootMenu.children, menu.items);
  }

  generateNgAlainMenus(ngAlainMenus: Menu[], appMenuItems: AppMenuItem[]): void {
    appMenuItems.forEach((item) => {
      let ngAlainMenu: Menu;
      ngAlainMenu = {
        text: this.translateService.instant(item.name),
        link: item.route,
        icon: { type: 'icon', value: item.icon },
        hide: !this.showMenuItem(item),
      };

      if (item.items && item.items.length > 0) {
        ngAlainMenu.children = [];
        this.generateNgAlainMenus(ngAlainMenu.children, item.items);
      }

      ngAlainMenus.push(ngAlainMenu);
    });
  }

  checkChildMenuItemPermission(menuItem: any): boolean {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < menuItem.items.length; i++) {
      const subMenuItem = menuItem.items[i];
      if (subMenuItem.permissionName && this.permission.getGrantedPolicy(subMenuItem.permissionName)) {
        return true;
      }

      if (subMenuItem.items && subMenuItem.items.length) {
        return this.checkChildMenuItemPermission(subMenuItem);
      } else if (!subMenuItem.permissionName) {
        return true;
      }
    }

    return false;
  }

  showMenuItem(menuItem: AppMenuItem): boolean {
    let hideMenuItem = false;
    if (menuItem.permissionName && !this.permission.getGrantedPolicy(menuItem.permissionName)) {
      hideMenuItem = true;
    }

    if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
      hideMenuItem = true;
    }

    if (!hideMenuItem && menuItem.items && menuItem.items.length) {
      return this.checkChildMenuItemPermission(menuItem);
    }

    return !hideMenuItem;
  }
}
