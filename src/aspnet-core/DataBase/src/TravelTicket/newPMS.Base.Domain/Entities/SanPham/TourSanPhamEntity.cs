using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("SP_TourSanPham")]
    public class TourSanPhamEntity : FullAuditedEntity<long>
    {
        [MaxLength(50)]
        [Required]
        public string Ma { get; set; }
        [Required]
        public string Ten { get; set; }
        public string LoaiHinhDuLichCode { get; set; }
        public int SoNgay { get; set; }
        public int SoDem { get; set; }
        public string QuocGiaId { get; set; }
        public string TinhId { get; set; }
        public string DiemKhoiHanh { get; set; }
        public string DiemDen { get; set; }
        public string GhiChu { get; set; }
        public int TinhTrang { get; set; } 
        public string LoaiTourCode { get; set; }
        public string TepDinhKemJson { get; set; }
        public string ThanhTienKhoangNguoiJson { get; set; }
        public string UrlAnhBia { get; set; }
        public string UrlHinhAnh { get; set; }
        public string ThongTinChung { get; set; }

        // Trạng thái mở bán 
        public int? SoLuongMoBan { get; set; }
        public DateTime? ThoiGianMoBan { get; set; }
    }
}
