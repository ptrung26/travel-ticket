using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("CV_CongViecTraoDoi")]
    public class CongViecTraoDoiEntity : FullAuditedEntity<long>
    {
        public long? CongViecId { get; set; }
        public long? SysUserId { get; set; }
        public long? ParentId { get; set; }
        public string NoiDung { get; set; }
    }
}