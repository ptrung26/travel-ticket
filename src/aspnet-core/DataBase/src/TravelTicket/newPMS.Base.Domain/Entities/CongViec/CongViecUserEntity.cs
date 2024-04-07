using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("CV_CongViecUser")]
    public class CongViecUserEntity : FullAuditedEntity<long>
    {
        public long? CongViecId { get; set; }
        public long? SysUserId { get; set; }
    }
}