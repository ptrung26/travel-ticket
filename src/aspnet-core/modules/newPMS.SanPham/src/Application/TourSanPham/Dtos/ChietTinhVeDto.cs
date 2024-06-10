using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.TourSanPham.Dtos
{
    public class ChietTinhVeDto : EntityDto<long>
    {
        public int NgayThu { get; set; }
        public long? NhaCungCapId { get; set; }

        public long TourSanPhamId { get; set; }
        public long? DichVuVeId { get; set; }
        public string KhoangKhachCode { get; set; }
        public string KhoangKhachDisplay { get; set; }
        public string TenNhaCungCap { get; set; }
        public string TenDichVu { get; set; }
        public decimal GiaNett { get; set; }
        public decimal TongChiPhi { get; set; }
        public bool IsHasThueVAT { get; set; }
    }
}
