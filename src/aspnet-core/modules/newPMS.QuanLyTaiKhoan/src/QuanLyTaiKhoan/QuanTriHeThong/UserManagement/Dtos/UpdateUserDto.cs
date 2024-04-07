namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class UpdateUserDto
    {
        public long Id { get; set; }
        public string HoTen { get; set; }
        public long? NhanLucId { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
    }
}
