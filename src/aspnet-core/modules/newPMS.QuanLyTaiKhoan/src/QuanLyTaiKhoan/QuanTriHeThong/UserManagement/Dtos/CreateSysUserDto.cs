namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class CreateOrUpdateSysUserDto
    {
        public long? Id { get; set; }
        public string UserName { get; set; }
        public string HoTen { get; set; }
        public string SurName { get; set; }
        public long? KhachHangId { get; set; }
        public int? LoaiTaiKhoan { get; set; }
        public int? Level { get; set; } //Enum
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public string MatKhau { get; set; }
        public bool? IsChangePassWord { get; set; }
    }
}
