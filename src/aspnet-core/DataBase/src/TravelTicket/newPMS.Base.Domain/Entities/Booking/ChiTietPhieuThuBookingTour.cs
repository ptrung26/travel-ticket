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
    [Table("Sys_ChiTietPhieuThuBookingTour")]
    public class ChiTietPhieuThuBookingTour : FullAuditedEntity<long>
    {
        public long BookingId { get; set; }

        [MaxLength(50)] 
        public string SoChungTu { get; set; }
        public DateTime? NgayChungTu { get; set; }
        public DateTime? NgayHachToan { get; set; }
        public string LoaiThuCode { get; set; }
        public decimal TongTien { get; set; }
        public string PhuongThucThanhToanCode { get; set; }
        public int TrangThai { get; set; }

        public DateTime? NgayCapNhat { get; set; }
        
    }
}
