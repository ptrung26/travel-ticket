using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.DichVuLe.Dtos
{
    public class DichVuTourDto
    {
        public string DichVuCode { get; set; }
        public string TenDichVu { get; set; }

        public List<ChiTietDichVuLeBookingDto> ListDichVu { get; set; }
    }

}
