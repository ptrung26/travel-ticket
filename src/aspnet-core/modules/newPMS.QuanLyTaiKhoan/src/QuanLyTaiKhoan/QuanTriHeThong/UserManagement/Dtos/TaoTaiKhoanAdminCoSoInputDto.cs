namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class TaoTaiKhoanAdminCoSoInputDto
    {
        public long BenhVienId { get; set; }
        public long SysRoleId { get; set; }
        public CreateOrUpdateSysUserDto UserDto { get; set; }
    }
}
