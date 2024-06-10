using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.Booking
{
    [Table("Sys_ChiTietBookingDichVuLe")]
    public class ChiTietBookingDichVuLeEntity : FullAuditedEntity<long>
    {
        public string NhaCungCapCode { get; set; }
        public long? BookingId { get; set; }
        public long? DichVuId { get; set; }
        public long? NhaCungCapId { get; set; }
        public string TenDichVu { get; set; }
        public int? SoLuong { get; set; }

        public decimal? DonGia { get; set; }
        public decimal? ThanhTien { get; set; }
        public string GhiChu { get; set; }
        public int TrangThai { get; set; }
        public int? NgayThu { get; set; }

        public string PhuongThucCod { get; set; }
    }
}
