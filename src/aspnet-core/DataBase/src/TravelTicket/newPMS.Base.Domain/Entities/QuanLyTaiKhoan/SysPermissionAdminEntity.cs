using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace newPMS.Entities
{
    /// <summary>
    /// Bảng cấu hình danh sách các Permission được load ra khi 1 tài khoản admin vào màn hình cấu hình quyền (Role)
    /// </summary>
    [Table("SysPermissionAdmin")]
    public class SysPermissionAdminEntity: Entity<int>
    {
        public long SysRoleId { get; set; }
        /// <summary>
        ///  Tên quyền
        /// </summary>
        [StringLength(500)]
        public string Name { get; set; }
    }
}
