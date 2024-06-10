using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("DV_HangPhong")]
    public class DichVuHangPhongEntity : FullAuditedEntity<long>
    {
        public string LoaiPhongCode { get; set; }
        public long NhaCungCapId { get; set; }
        public string TenHangPhong { get; set; }
        public string MoTa { get; set; }
        public int? SoLuongPhong { get; set; }
        public int? SoKhachToiDa { get; set; }
        public int? KichThuocPhong { get; set; }
        public int? SlPhongFOC { get; set; }
        public string TienIchPhong { get; set; }

        public string JsonTaiLieu { get; set; }
    }
}
