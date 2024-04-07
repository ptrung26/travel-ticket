using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;
using Volo.Abp.PermissionManagement;

namespace newPMS.QuanTriHeThong.Dtos
{
    public class SysRoleDto : EntityDto<long>
    {
        /// <summary>
        /// Reference tới Id của bảng AbpRoles của Identity
        /// </summary>
        public Guid RoleId { get; set; }
        [StringLength(256)]
        public string Ma { get; set; }
        [StringLength(500)]
        public string Ten { get; set; }

      
        /// <summary>
        /// Nếu IsStatic = 1 ===> quyền chung
        /// </summary>
        public bool IsStatic { get; set; }
        /// <summary>
        /// Danh sách các loại cơ sở áp dụng (dùng cho role static)
        /// 1;2;3;4
        /// </summary>
        /// 
        public bool IsDefault { get; set; }
        public bool? IsActive { get; set; }
        public int? Level { get; set; }

        public bool IsSelected { get; set; }
    }

    public class SysRolePermissionDto
    {
        public long SysRoleId { get; set; }
        public List<string> PermissionNames { get; set; }
    }

    public class SysUserRolePermissionDto
    {
        public long SysUserId { get; set; }
        public List<string> PermissionNamesRole { get; set; } = new List<string>();
        public List<string> PermissionNamesUser { get; set; } = new List<string>();
    }

    public class SysUserRolePermissionTreeNodeDto
    {
        public string DisplayName { get; set; }
        public string Name { get; set; }
        public bool Expanded { get; set; }
        public bool IsLeaf { get; set; }
        public bool DisableCheckbox { get; set; }
        public List<SysUserRolePermissionTreeNodeDto> Children { get; set; } = new List<SysUserRolePermissionTreeNodeDto>();
    }

}
