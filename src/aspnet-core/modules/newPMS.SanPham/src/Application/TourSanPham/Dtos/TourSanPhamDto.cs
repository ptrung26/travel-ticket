using OrdBaseApplication.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.TourSanPham.Dtos
{
    public class TourSanPhamDto : EntityDto<long>
    {
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string LoaiHinhDuLichCode { get; set; }
        public string LoaiHinhDuLichDisplay { get; set; }
        public int SoNgay { get; set; }
        public int SoDem { get; set; }
        public string QuocGia { get; set; }
        public string QuocGiaId { get; set; }
        public string TinhId { get; set; }
        public string Tinh { get; set; }
        public string DiemKhoiHanh { get; set; }
        public string DiemDen { get; set; }
        public string GhiChu { get; set; }
        public int TinhTrang { get; set; } // 1. Chưa mở bán, 2.Mở bán 
        public string LoaiTourCode { get; set; }
        public string LoaiTourDisplay { get; set; }
        public string TepDinhKemJson { get; set; }
        public string UrlAnhBia { get; set; }
        public string UrlHinhAnh { get; set; }
        public string ThongTinChung { get; set; }
        public string ThanhTienKhoangNguoiJson { get; set; }
        public List<DichVuTour> ListDichVu { get; set; }

        public List<ChuongTrinhTourDto> ListChuongTrinhTour { get; set; }

        // Trạng thái mở bán
        public int? SoLuongMoBan { get; set; }
        public DateTime? NgayMoBan { get; set; }
    }

    public class DichVuTour
    {
        public string TenDichVu { get; set; }
        public string DichVuCode { get; set; }
    }
}
