using newPMS.Entities;
using System;
using System.Collections.Generic;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class RefreshPermissionForRoleDto
    {
        public string RoleName { get; set; }
        public List<string> ListOfPermissions { get; set; }
    }
    public class RefreshPermissionForUserDto
    {
        public string UserName { get; set; }
        public List<string> ListOfPermissions { get; set; }
    }
    public class InputSetPermissionForSysRoleDto
    {
        public long SysRoleId { get; set; }
        public List<string> PermissionNames { get; set; }
    }

    public class InputSetPermissionForSysUserDto
    {
        public long SysUserId { get; set; }
        public List<string> PermissionNamesInsert { get; set; }
        public List<string> PermissionNamesRemove { get; set; }
    }

    public class RoleInputDto
    {
        public List<CauHinhRoleDto> ArrRoleLevelConfig { get; set; }
    }
    public class RoleLevelDto //: RoleLevel
    {
        public long? Id { get; set; }
        public string NameLevel { get; set; }
        public long? RoleId { get; set; }
        public string Ma { get; set; }
        public string Ten { get; set; }
        public bool? IsActive { get; set; }
        public int? Level { get; set; }
        public bool? IsDefault { get; set; }
    }
    public class CauHinhRoleDto
    {
        public long Id { get; set; }
        public string RoleName  { get; set; }
        public bool? IsDefault { get; set; }
        public List<RoleLevelDto> ListRoleLevel { get; set; }
    }

    public class TreePermissionDto
    {
        public string Title { get; set; }
        public string Key { get; set; }
        public bool? Expanded { get; set; }
        public bool? IsLeaf { get; set; }
        public bool? Checked { get; set; }
        public bool? DisableCheckbox { get; set; }
        public bool? IsHalfChecked { get; set; }
        public List<TreePermissionDto> Children { get; set; }
    }

    public class TreeNodePermissionNameDto
    {
        public string Title { get; set; }
        public int? Count { get; set; }
        public List<TreePermissionDto> ListTreePermission { get; set; }
    }

    public class UpdatePermissionUserDto
    {
        public long SysUserId { get; set; }
        public List<string> Permissions { get; set; }
    }

    public class UpdatePermissionRoleDto
    {
        public long SysRoleId { get; set; }
        public List<string> Permissions { get; set; }
    }
}
