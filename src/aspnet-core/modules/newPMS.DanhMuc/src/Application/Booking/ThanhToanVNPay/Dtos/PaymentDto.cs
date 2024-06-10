using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.ThanhToanVNPay.Dtos
{
    public class PaymentDto
    {
        #region Thông tin chung
        public string TenKhachHang { get; set; }
        public string QuocGiaId { get;set; }
        public string SoDienThoai { get; set; } 
        public string Email { get;set; }
        public string DiaChi { get; set; }
        #endregion

        #region Dịch vụ
        public long TourId { get; set; }
        public string TenTour { get; set; }
        public string NgayBatDau { get; set; }
        public int SoLuongNguoiLon { get; set; }
        public decimal Gia { get; set; }
        public decimal ThanhTien { get; set; }

        #endregion
    }
}
