using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.Booking
{
    [Table("Sys_ChiTietThanhVienDoanBooking")]
    public class ChiTietThanhVienDoanBooking : FullAuditedEntity<long>
    {
        public long BookingId { get;set; }
        public string Ten { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public long QuocTichId { get; set; }
        public string VaiTroCode { get; set; }
    }
}
