import { ILayoutMenu } from '@shared/ora-layout/ora-layout-horizontal/menu-defines/interface-layout-menu';

const prefix = '/khach-hang/';

export const LayoutMenuKhachHang: ILayoutMenu[] = [
    {
        text: 'Khách hàng',
        level: 0,
        link: '',
        permission: '',
        children: [
            {
                text: 'Khách hàng',
                level: 1,
                link: prefix + 'danh-sach',
                permission: 'DanhMuc.NhaCungCap',
            },
        ],
    }
];
