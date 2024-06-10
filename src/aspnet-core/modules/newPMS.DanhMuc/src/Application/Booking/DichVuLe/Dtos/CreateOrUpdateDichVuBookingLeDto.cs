using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.DichVuLe.Dtos
{
    public class CreateOrUpdateDichVuBookingLeDto : EntityDto<long>
    {
        public string NhaCungCapCode { get; set; }
        public long? BookingId { get; set; }
        public long? DichVuId { get; set; }
        public long? NhaCungCapId { get; set; }
        public string TenDichVu { get; set; }
        public int? SoLuong { get; set; }

        public decimal? DonGia { get; set; }
        public decimal? ThanhTien { get; set; }
        public string GhiChu { get; set; }

        public int TrangThai { get; set; }
    }
}
