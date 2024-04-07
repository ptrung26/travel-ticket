using System.Collections.Generic;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class DanhSachCauHinhSysAppPrivateRoleDto
    {
        public List<CauHinhSysAppPrivateRoleItemDto> ListOfPhongBan { get; set; }
    }

    public class CauHinhSysAppPrivateRoleItemDto
    {
        public long Id { get; set; }
        public string Ma { get; set; }
        public string Ten { get; set; }
        public bool IsCheck { get; set; } = false;
    }
}
