using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.KhachHang
{
    [Table("Sys_KhachHang")]
    public class KhachHangEntity : FullAuditedEntity<long>
    {
        [Required]
        [MaxLength(50)]
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string SoDienThoai { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public long? NguoiTaoId { get; set; } 
        public string TenNguoiTao { get; set; }

        public string QuocTichId { get; set; }

        public long? SysUserId { get; set; } // Người dùng tự tạo tài khoản hoặc admin tự thêm
    }
}
