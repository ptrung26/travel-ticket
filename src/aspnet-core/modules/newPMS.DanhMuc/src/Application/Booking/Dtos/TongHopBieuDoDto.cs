using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.Dtos
{
    public class TongHopBieuDoDto
    {
        public int  SoLuongBooking { get; set; }
        public int SoLuongKhachHang { get; set; }
        public decimal TongDoanhThu { get; set; }

        public List<DoanhThuTheoThang> ListDoanhThuTheoThang { get; set; }
    }

    public class DoanhThuTheoThang
    {
        public int Thang { get; set; }
        public decimal DoanhThu { get; set; }

    }
}
