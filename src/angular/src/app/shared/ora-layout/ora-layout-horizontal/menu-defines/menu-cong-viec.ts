import {ILayoutMenu} from '@shared/ora-layout/ora-layout-horizontal/menu-defines/interface-layout-menu';

const prefix = '/cong-viec/';

export const LayoutMenuCV: ILayoutMenu[] = [
  {
    text: 'Quản lý công việc',
    permission: 'CongViec.QuanLyCongViec',
    level: 0,
    link: '',
    children: [
      {
        text: 'Danh sách công việc',
        permission: 'CongViec.QuanLyCongViec',
        level: 1,
        link: prefix + 'quan-ly-cong-viec/danh-sach',
      },
      {
        text: 'Công việc cá nhân',
        permission: 'CongViec.QuanLyCongViec.TruongPhong',
        level: 1,
        link: prefix + 'quan-ly-cong-viec/ca-nhan',
      },
    ],
  },
  {
    text: 'Quản lý chất lượng',
    permission: 'CongViec.QuanLyChatLuong',
    level: 0,
    link: '',
    children: [
      {
        text: 'Hành động phòng ngừa',
        permission: 'CongViec.QuanLyCongViec',
        level: 1,
        link: prefix + 'hanh-dong-phong-ngua',
      },
      {
        text: 'Hành động khắc phục',
        permission: 'CongViec.QuanLyCongViec',
        level: 1,
        link: prefix + 'hanh-dong-khac-phuc',
      },
    ],
  },
  {
    text: 'Lịch công việc',
    permission: 'CongViec.LichCongViec',
    level: 0,
    link: '',
    children: [
      {
        text: 'Lịch công việc',
        permission: 'CongViec.LichCongViec',
        level: 1,
        link: prefix + 'lich-cong-viec',
      },
    ],
  },
];

