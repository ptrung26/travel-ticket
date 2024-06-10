import { ILayoutMenu } from '@shared/ora-layout/ora-layout-horizontal/menu-defines/interface-layout-menu';

const prefix = '/booking/';

export const LayoutMenuBooking: ILayoutMenu[] = [
    {
        text: 'Booking',
        level: 0,
        link: '',
        permission: '',
        children: [
            {
                text: 'Danh sách',
                level: 1,
                link: prefix + 'danh-sach',
                permission: 'DanhMuc.NhaCungCap',
            },
        ],
    }
];
