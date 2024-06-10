using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.ThanhVienDoan.Dtos
{
    public class ChiTietThanhVienDoanDto : EntityDto<long>
    {
        public long BookingId { get; set; }
        public string Ten { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public long QuocTichId { get; set; }
        public string VaiTroCode { get; set; }
    }
}
