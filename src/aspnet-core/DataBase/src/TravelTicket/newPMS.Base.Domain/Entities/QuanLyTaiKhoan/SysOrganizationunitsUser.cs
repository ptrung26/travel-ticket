using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("SysOrganizationunitsUser")]
    public class SysOrganizationunitsUser : FullAuditedEntity<long>
    {
        public long SysOrganizationunitsId { get; set; }
        public long SysUserId { get; set; }
    }
}
