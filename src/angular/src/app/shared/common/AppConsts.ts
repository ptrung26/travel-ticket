export class CodeSystemConst {
  static gender = 'gender';
  static NguonKinhPhi = 'NguonKinhPhi';
  static DanToc = 'DanToc';
}

export class ComboBoxTableCode {
  static PhongBanId = 'PHONG_BAN_ID';
  static NhanVienId = 'NHAN_VIEN_ID';
  static KhoaHoc = 'KhoaHoc';
  static TreeOrganizationUnit = 'TreeOrganizationUnit';
  static OrganizationUnitByUserId = 'OrganizationUnitByUserId';
  static GetAllUsersToDLLByPhongBanId = 'GetAllUsersToDLLByPhongBanId';
}

export class ComboBoxEnumCode {
  static Level = 'LEVEL';
}

export const Level_Phan_Quyen = [];

export const PhuongThucHoTroCombobox = [
  {
    value: '1',
    displayText: 'Email',
    hideText: 'Hệ thống ghi nhận thành công. MTravel sẽ liên hệ với bạn trong vòng 24h.',
    isActive: true,
  },
  {
    value: '2',
    displayText: 'Điện thoại',
    hideText: 'Hệ thống ghi nhận thành công. MTravel sẽ liên hệ với bạn trong vòng 24h.',
    isActive: true,
  },
  {
    value: '3',
    displayText: 'Chat',
    hideText: 'Chào bạn, QCC đã nhận được thắc mắc. MTravel sẽ phản hồi lại ngay khi có câu trả lời.',
    isActive: true,
  },
];
