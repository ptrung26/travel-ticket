using System;
using System.Collections.Generic;

namespace OrdBaseApplication.Dtos
{
    public class UserSessionDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public long SysUserId { get; set; }
        public string HoTen { get; set; }
        public long? KhachHangId { get; set; }
        public string TenKhachHang { get; set; }
        public bool? IsBlackList { get; set; }
        public DateTime? DateBlackList { get; set; }
        public bool? IsChanDangKy { get; set; }
        public int? RolesLevel { get; set; }

        public List<long?> ListPhongBanId { get; set; }
        public List<int?> ListLevel { get; set; }

        public string Email { get; set; }
        public string SoDienThoai { get; set; }

    }
}