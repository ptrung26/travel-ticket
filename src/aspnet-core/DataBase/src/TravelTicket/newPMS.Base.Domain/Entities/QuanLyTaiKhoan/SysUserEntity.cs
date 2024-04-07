using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("SysUser")]
    public class SysUserEntity : FullAuditedEntity<long>
    {
        public Guid UserId { get; set; }
        public int? Level { get; set; } //Enum
        public long? KhachHangId { get; set; }
        [StringLength(50)]
        public string MaKhachHang { get; set; }
        public long? PhongBanId { get; set; }
        [StringLength(50)]
        public string MaPhongBan { get; set; }
        public long? NhanVienId { get; set; }
        public int? LoaiTaiKhoan { get; set; } //Enum - LOAI_TAI_KHOAN

        #region Thông tin của người dùng
        [StringLength(256)]
        public string UserName { get; set; }
        [StringLength(200)]
        public string HoTen { get; set; }
        [StringLength(200)]
        public string HoTenKhongDau { get; set; }
        [StringLength(500)]
        public string Email { get; set; }
        [StringLength(50)]
        public string SoDienThoai { get; set; }
        #endregion

        public string Avatar { get; set; } //Lưu ảnh đại diện vào đây
        public long? UserV1Id { get; set; } //Dùng để migration dữ liệu từ v1 lên v2
    }
}
