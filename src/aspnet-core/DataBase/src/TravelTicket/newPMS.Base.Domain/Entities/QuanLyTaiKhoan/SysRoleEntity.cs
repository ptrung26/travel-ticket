using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("SysRole")]
    public class SysRoleEntity: FullAuditedEntity<long>
    {
        /// <summary>
        /// Reference tới Id của bảng AbpRoles của Identity
        /// </summary>
        public Guid RoleId { get; set; }
        public int? Level { get; set; } //Enum

        /// <summary>
        /// Reference tới Name của bảng AbpRoles của Identity
        /// </summary>
        [StringLength(256)]
        public string Ma { get; set; }
        [StringLength(500)]
        public string Ten { get; set; }
        public bool? IsDefault { get; set; }
    }
}
