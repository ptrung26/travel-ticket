using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("CV_CongViecLichSu")]
    public class CongViecLichSuEntity : CreationAuditedEntity<long>
    {
        public long? CongViecId { get; set; }
        public long? SysUserId { get; set; }
        [MaxLength(500)]
        public int TrangThai { get; set; } //TrangThai
        public string HanhDong { get; set; }
        public string GhiChu { get; set; }//Nếu có ghi chú trong bước xử lý
    }
}