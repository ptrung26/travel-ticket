using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.Booking
{
    [Table("Sys_BookingDichVuTour")]
    public class BookingDichVuTourEntity : FullAuditedEntity<long>
    {
        public long BookingId { get; set; } 
        public long? TourId { get; set; }

        public string TenTour { get; set; }

        public DateTime? NgayBatDau { get; set; }

        public int? SoLuongNguoiLon { get; set; }
        public int? SoLuongTreEm { get; set; }
        public string DiemDen { get; set; }
        public DateTime? GioDon { get; set; }

    }
}
