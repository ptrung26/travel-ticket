using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    public class ChuongTrinhTourEntity : FullAuditedEntity<long>
    {
        [Required]
        public long TourSanPhamId { get; set; }
        public int NgayThu { get; set; }
        public int TenHanhTrinh { get; set; }
        public string TepDinhKemJson { get; set; }
        public string NoiDung { get; set; }
        public string DiemDen { get; set; }

    }
}
