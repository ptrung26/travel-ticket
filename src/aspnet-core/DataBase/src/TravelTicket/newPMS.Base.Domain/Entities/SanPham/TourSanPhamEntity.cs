using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
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
        public string MaQuocGiaCode { get; set; }
        public string MaTinhCode { get; set; }
        public string DiemKhoiHanh { get; set; }
        public string GhiChu { get; set; }
        public int TinhTrang { get; set; } // 1. Chưa mở bán, 2.Mở bán 
        public string LoaiTourCode { get; set; }
        public string TepDinhKemJson { get; set; }
    }
}
