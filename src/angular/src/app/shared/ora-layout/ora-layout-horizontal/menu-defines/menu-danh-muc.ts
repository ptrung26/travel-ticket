import { ILayoutMenu } from '@shared/ora-layout/ora-layout-horizontal/menu-defines/interface-layout-menu';

const preFix = '/danh-muc/';
export const LayoutMenuDM: ILayoutMenu[] = [
  {
    text: 'Danh mục chung',
    permission: '',
    level: 0,
    link: '',
    children: [
      {
        text: 'Danh mục chung',
        permission: 'DanhMuc.CodeSystem',
        level: 1,
        link: preFix + 'danh-muc-chung',
      },
      {
        text: 'Cấu hình chung',
        permission: 'DanhMuc.SystemConfig',
        level: 1,
        link: preFix + 'cau-hinh-chung',
      },
      {
        text: 'Quốc gia',
        permission: 'DanhMuc.QuocGia',
        level: 1,
        link: preFix + 'quoc-tich',
      },
      {
        text: 'Lĩnh vực',
        permission: 'DanhMuc.Linhvuc',
        level: 1,
        link: preFix + 'linh-vuc',
      },
      {
        text: 'Tỉnh',
        permission: 'DanhMuc.Tinh',
        level: 1,
        link: preFix + 'tinh',
      },
      {
        text: 'Huyện',
        permission: 'DanhMuc.Huyen',
        level: 1,
        link: preFix + 'huyen',
      },
      {
        text: 'Xã',
        permission: 'DanhMuc.Xa',
        level: 1,
        link: preFix + 'xa',
      },
    ],
  },
  {
    text: 'Nhà cung cấp',
    permission: '',
    level: 0,
    link: '',
    children: [
      {
        text: 'Khách sạn',
        permission: 'DanhMuc.NhaCungCap',
        level: 1,
        link: preFix + 'nha-cung-cap/khach-san',
      },
      {
        text: 'Xe ô tô',
        permission: 'DanhMuc.NhaCungCap',
        level: 1,
        link: preFix + 'nha-cung-cap/xe-oto',
      },
      {
        text: 'Vé thắng cảnh',
        permission: 'DanhMuc.NhaCungCap',
        level: 1,
        link: preFix + 'nha-cung-cap/ve-thang-canh',
      },
    ],
  }

];
