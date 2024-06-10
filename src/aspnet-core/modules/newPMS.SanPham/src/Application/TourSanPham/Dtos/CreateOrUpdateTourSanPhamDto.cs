using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.TourSanPham.Dtos
{
    public class CreateOrUpdateTourSanPhamDto : EntityDto<long>
    {
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string LoaiHinhDuLichCode { get; set; }
        public int SoNgay { get; set; }
        public int SoDem { get; set; }
        public string QuocGiaId { get; set; }
        public string TinhId { get; set; }
        public string DiemKhoiHanh { get; set; }
        public string DiemDen { get; set; }
        public string GhiChu { get; set; }
        public int TinhTrang { get; set; } // 1. Chưa mở bán, 2.Mở bán 
        public string LoaiTourCode { get; set; }
        public string TepDinhKemJson { get; set; }
        public string ThanhTienKhoangNguoiJson { get; set; }
        public string UrlAnhBia { get; set; }
    }
}
