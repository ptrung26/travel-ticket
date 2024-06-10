using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.KhachHang
{
    [Table("Sys_HuongDanVien")]
    public class HuongDanVienEntity : FullAuditedEntity<long>
    {
        public Guid? UserId { get;set; }
        public long? SysuserId { get;set; } 
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string SoDienThoai { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public long? NguoiTaoId { get; set; }
        public string TenNguoiTao { get; set; }
        public string ThongThaoNgonNguJSON { get; set; }
        public DateTime? NgayLamViec { get; set; }
        public string TrangThai { get; set; } // 1. Đang làm việc, 2. Đã nghỉ việc 
    }
}
