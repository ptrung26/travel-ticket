import { ILayoutMenu } from '@shared/ora-layout/ora-layout-horizontal/menu-defines/interface-layout-menu';

const prefix = '/san-pham/';

export const LayoutmenuSP: ILayoutMenu[] = [
    {
        text: 'Tour sản phẩm',
        level: 0,
        link: '',
        permission: '',
        children: [
            {
                text: 'Tour sản phẩm',
                level: 1,
                link: prefix + 'tour-san-pham',
                permission: 'DanhMuc.NhaCungCap',
            },
        ],
    }
];
