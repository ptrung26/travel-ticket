using System;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace newPMS.Entities
{
    [Table("SysUserRole")]
    public class SysUserRoleEntity : Entity<long>
    {
        public long SysRoleId { get; set; }

        /// <summary>
        /// Id của bảng UserExtension
        /// </summary>
        public long SysUserId { get; set; }
    }
}
