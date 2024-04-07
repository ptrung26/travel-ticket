import { Menu } from '@node_modules/@delon/theme';

export class MenuConfig {
  preFix = '/cong-viec/';
  public defaults: OraMenu[] = [
    new OraMenu('Quản lý công việc', '', 'CongViec.QuanLyCongViec', [
      new OraMenuItem({
        router: this.preFix + 'danh-sach',
        title: 'Danh sách công việc',
        iconSrc: 'icon-danh-muc/health-index.svg',
        // permission: 'CongViec.DanhSach',
      }),
      new OraMenuItem({
        router: this.preFix + 'tong-quan',
        title: 'Tổng quan',
        iconSrc: 'icon-danh-muc/health-index.svg',
        // permission: 'CongViec.DanhSach',
      }),
    ]),
  ];

  public get configs(): OraMenu[] {
    return this.defaults;
  }

  public get menuLeftData(): Menu[] {
    let res: Menu[] = [];
    this.defaults.map((item) => {
      const menus: Menu[] = item.child.map((ite) => {
        return {
          link: ite.router,
          hide: true,
          text: ite.title,
          key: ite.router,
        };
      });
      res = res.concat(menus);
    });
    return res;
  }
}

export class OraMenu {
  title: string;
  iconSrc: string;
  permission?: string;
  child?: OraMenuItem[];

  constructor(title: string, iconSrc?: string, permission?: string, child?: OraMenuItem[]) {
    this.title = title;
    this.iconSrc = iconSrc;
    this.permission = permission;
    this.child = child ? child : [];
  }

  get totalItem(): number {
    return this.child.length;
  }
}

export class OraMenuItem {
  router: string;
  title: string;
  permission?: string;
  iconSrc?: string;

  constructor(val: OraMenuItem) {
    this.router = val.router;
    this.title = val.title;
    this.permission = val.permission;
    this.iconSrc = val.iconSrc;
  }
}
