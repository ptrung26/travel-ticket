import { Menu } from '@node_modules/@delon/theme';

export class MenuConfig {
  preFix = '/danh-muc/';
  public defaults: OraMenu[] = [
    new OraMenu('Danh mục chung', '', '', [
      new OraMenuItem({
        router: this.preFix + 'danh-muc-chung',
        title: 'Danh mục chung',
        iconSrc: 'icon-danh-muc/health-index.svg',
        permission: 'DanhMuc.CodeSystem',
      }),
      new OraMenuItem({
        router: this.preFix + 'cau-hinh-chung',
        title: 'Cấu hình chung',
        iconSrc: 'icon-danh-muc/health-index.svg',
        permission: 'DanhMuc.SystemConfig',
      }),
      new OraMenuItem({
        router: this.preFix + 'quoc-tich',
        title: 'Quốc gia',
        iconSrc: 'icon-danh-muc/health-index.svg',
        permission: 'DanhMuc.QuocGia',
      }),
      new OraMenuItem({
        router: this.preFix + 'tinh',
        title: 'Tỉnh',
        iconSrc: 'icon-danh-muc/health-index.svg',
        permission: 'DanhMuc.Tinh',
      }),
      new OraMenuItem({
        router: this.preFix + 'huyen',
        title: 'Huyện',
        iconSrc: 'icon-danh-muc/health-index.svg',
        permission: 'DanhMuc.Huyen',
      }),
      new OraMenuItem({
        router: this.preFix + 'xa',
        title: 'Xã',
        iconSrc: 'icon-danh-muc/health-index.svg',
        permission: 'DanhMuc.Xa',
      }),
      new OraMenuItem({
        router: this.preFix + 'nhacungap',
        title: 'Nhà cung cấp',
        permission: 'DanhMuc.NhaCungCap',
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

  get totalItem(): number {
    return this.child.length;
  }

  constructor(title: string, iconSrc?: string, permission?: string, child?: OraMenuItem[]) {
    this.title = title;
    this.iconSrc = iconSrc;
    this.permission = permission;
    this.child = child ? child : [];
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
