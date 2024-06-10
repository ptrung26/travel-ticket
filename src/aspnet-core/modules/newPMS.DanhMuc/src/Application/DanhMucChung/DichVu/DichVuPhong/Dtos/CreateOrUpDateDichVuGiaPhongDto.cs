using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.DichVu.DichVuPhong.Dtos
{
    public class CreateOrUpDateDichVuGiaPhongDto : EntityDto<long>
    {
        public long NhaCungCapKhachSanId { get; set; }
        public long HangPhongId { get; set; }
        public string TenPhong { get; set; }

        public string LoaiPhongCode { get; set; }
        public string LoaiTienTeCode { get; set; }
        public decimal? GiaFOTNettNgayThuong { get; set; }
        public decimal? GiaFOTBanNgayThuong { get; set; }
        public decimal? GiaFOTNettNgayLe { get; set; }
        public decimal? GiaFOTBanNgayLe { get; set; }
        public DateTime? NgayApDungTu { get; set; }
        public DateTime? NgayApDungDen { get; set; }
        public string GhiChu { get; set; }
        public bool IsHasThueVAT { get; set; }
    }
}
