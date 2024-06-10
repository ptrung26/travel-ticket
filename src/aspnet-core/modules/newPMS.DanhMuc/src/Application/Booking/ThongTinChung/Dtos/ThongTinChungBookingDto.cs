using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.Dtos
{
    public class ThongTinChungBookingDto : EntityDto<long>
    {
        // Thông tin chung
        public string Ma { get; set; }

        public string Ten { get; set; }
        public long? TinhId { get; set; }
        public string TenTinh { get; set; }
        public string KenhBanHang { get; set; }
        public long NhanVienId { get; set; } 
        public string TenNhanVien { get; set; }
        public string GhiChu { get; set; }

        public string TenTour { get; set; }
        public int SoLuongNguoi { get; set; }

        public string PhuongThucCode { get; set; }

        // Thông tin liên hệ 
        public string LoaiKhachHangCode { get; set; }
        public long KhachHangId { get; set; }
        public long? SysUerId { get; set; }
        public string TenKhachHang { get; set; }
        public string QuocTich { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public string DiaChi { get; set; }

        public int? TrangThai { get; set; }
        public DateTime? NgayLap { get; set; }

        public decimal? ThanhTien { get; set; }

    }
}
