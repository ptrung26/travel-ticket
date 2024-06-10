using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.Booking
{
    [Table("Sys_ChiTietBookingDichVuTour")]
    public class ChiTietBookingDichVuTourEntity : FullAuditedEntity<long>
    {
        public long BookingId { get; set; }
        public long BookingTourId { get;set; }
        public string LoaiDoTuoi { get; set; } 
        public decimal GiaNett { get; set; }
        public decimal GiaBan { get; set; }
        public int SoLuong { get; set; }
        public decimal ThanhTien { get; set; }
    }
}
