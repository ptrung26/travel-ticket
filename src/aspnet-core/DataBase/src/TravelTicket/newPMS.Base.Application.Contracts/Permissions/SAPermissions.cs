using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Reflection;

namespace newPMS.Permissions
{
    public static class SuperAdminPermissions
    {
        public const string IsSuperAdmin = GroupNameConst.SuperAdmin + "IsSuperAdmin";
        public const string RoleStatic = GroupNameConst.SuperAdmin + "RoleStatic";
        public const string UserOfAdmin = GroupNameConst.SuperAdmin + "UserOfAdmin";
        public const string CauHinhHeThong = GroupNameConst.SuperAdmin + "CauHinhHeThong";
        public static string[] GetAll()
        {
            return ReflectionHelper.GetPublicConstantsRecursively(typeof(SuperAdminPermissions));
        }
    }
    public class SuperAdminPermissionDefinitionProvider : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var group = context.AddGroup(GroupNameConst.SuperAdmin.Trim('.'));
            // lưu ý phải đúng với Tên Permissions bên trên 
            foreach (var permission in SuperAdminPermissions.GetAll())
            {
                group.AddPermission(permission);
            }
        }
    }
}
