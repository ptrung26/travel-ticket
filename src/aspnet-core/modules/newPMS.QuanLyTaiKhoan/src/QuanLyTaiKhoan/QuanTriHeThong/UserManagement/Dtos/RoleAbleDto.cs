using System;
using System.Collections.Generic;
using System.Text;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class RoleAbleDto
    {
        public long SysRoleId { get; set; }
        public string Ma { get; set; }
        public string Ten { get; set; }
        public bool IsCheck { get; set; } = false;
        public bool IsStatic { get; set; }
        public bool IsAdminTuyen { get; set; }
    }

    public class GetRoleTaiKhoanDto
    {
        public int? Level { get; set; }
    }
}
