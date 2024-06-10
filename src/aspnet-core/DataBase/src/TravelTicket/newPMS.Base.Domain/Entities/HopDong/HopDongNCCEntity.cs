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
    [Table("DM_HopDongNCC")]
    public class HopDongNCCEntity : FullAuditedEntity<long>
    {
        public long NhaCungCapId { get; set; }
        [Required]
        public string Ma { get; set; }
        public string LoaiHopDongCode { get; set; }
        public DateTime NgayHieuLuc { get; set; }
        public DateTime NgayHetHan { get; set; }
        public DateTime NgayKy { get; set; }
        public string NguoiLapHopDong { get; set; }
        public int TinhTrang { get; set; } // 1. Đã tạo, 2. Đã ký, 3. Đã huỷ, 4. Đã hết hạn 
        public string MoTa { get; set; }
        
    }
}
