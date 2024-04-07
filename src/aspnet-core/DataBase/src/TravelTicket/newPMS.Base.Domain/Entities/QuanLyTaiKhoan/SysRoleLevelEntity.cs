using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("SysRoleLevel")]
    public class SysRoleLevelEntity : CreationAuditedEntity<long>
    {
        public int Level { get; set; }
        public long SysRoleId { get; set; }
    }
}