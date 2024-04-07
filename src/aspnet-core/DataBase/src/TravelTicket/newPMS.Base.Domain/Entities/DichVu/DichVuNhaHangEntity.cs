using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    public class DichVuNhaHangEntity : FullAuditedEntity<long>
    {
        public string CategoryCode { get; set; }
        public string Ten { get; set; }
        public string LoaiTienTeCode { get; set; }
        public string DatBanCode { get; set; } 
        public decimal GiaNett { get; set; }
        public decimal GiaBan { get; set; }
        public string GhiChu { get; set; }
        public bool IsHasThueVas { get; set; }
        public string JsonTaiLieu { get; set; }
    }
}
