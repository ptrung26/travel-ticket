using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.Booking
{
    [Table("Sys_ChiTietLichHenBookingTour")]
    public class ChiTietLichHenBookingTour : FullAuditedEntity<long>
    {
        public long BookingId { get; set; } 
        public string TieuDe { get; set; }
        public string NoiDung { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public string DiaDiem { get; set; }
    }
}
