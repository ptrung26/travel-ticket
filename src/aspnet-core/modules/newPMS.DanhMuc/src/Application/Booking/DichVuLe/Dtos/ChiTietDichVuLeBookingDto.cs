using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.DichVuLe.Dtos
{
    public class ChiTietDichVuLeBookingDto : EntityDto<long>
    {
        public long? BookingId { get; set; }
        public string NhaCungCapCode { get;set; }
        public string NhaCungCapDisplay { get; set; }
        public long? DichVuId { get; set; }
        public string TenDichVu { get; set; }
        public long? NhaCungCapId { get; set; }

        public string TenNhaCungCap { get; set; }

        public string Email { get; set; }
        public string SoDienThoai { get; set; }

        public decimal? DonGia { get; set; }
        public int? SoLuong { get; set; }

        public string KhoangKhachCode { get; set; }
        public decimal? ThanhTien { get; set; }
        public string GhiChu { get; set; }

        public int TrangThai { get; set; }
        public int Ngaythu { get; set; }
        public string PhuongThucCode { get; set; }


        // Dịch vu xe 
        public string LoaiXe { get; set; }
        public string SoChoNgoi { get; set; }

    }
}
