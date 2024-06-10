using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.Booking
{
    [Table("sys_Booking")]
    public class BookingEntity : FullAuditedEntity<long>
    {
        // Thông tin chung
        [Required]
        [MaxLength(50)]
        public string Ma { get; set; }
        public string Ten { get; set; }
        public long? TinhId { get; set; }
        public string KenhBanHang { get; set; }
        public long? NhanVienId { get; set; } // Nhân viên bán hàng 
        public string GhiChu { get; set; }

        // Thông tin liên hệ 
        public string LoaiKhachHangCode { get; set; }
        public long KhachHangId { get;set; }

        public long? SysUerId { get; set; }
        public DateTime? NgayLap { get; set; }

        public int? TrangThai { get; set; }

        public decimal? ThanhTien { get; set; }
        
        public string PhuongThucCode { get; set; }

        public string SoTaiKhoan { get; set; }
        
        // Nếu hoàn tiền
        public DateTime? ThoiGianHoanTien { get; set; }
        public decimal? SoTienHoan { get; set; }
    }
}
