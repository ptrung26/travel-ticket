import {ILayoutMenu} from '@shared/ora-layout/ora-layout-horizontal/menu-defines/interface-layout-menu';

const prefix = '/admin/';

export const LayoutMenuQT: ILayoutMenu[] = [
  {
    text: 'Vai trò',
    permission: 'AbpIdentity.Roles',
    level: 0,
    link: prefix + 'roles',
  },
  {
    text: 'Người dùng',
    permission: 'AbpIdentity.Users',
    level: 0,
    link: prefix + 'users',
  },
  {
    text: 'Cơ cấu tổ chức',
    permission: 'AbpIdentity.OrganizationUnits',
    level: 0,
    link: prefix + 'organization-units',
  },
  {
    text: 'Cấu hình hệ thống',
    permission: 'AbpIdentity.SettingManagement',
    level: 0,
    link: prefix + 'setting-management',
  },
];
