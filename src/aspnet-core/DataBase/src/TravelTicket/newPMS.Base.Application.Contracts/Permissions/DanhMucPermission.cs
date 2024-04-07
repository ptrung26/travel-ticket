using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Reflection;

namespace newPMS.Permissions
{
    public class DanhMucGroup : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var group = context.AddGroup("DanhMuc");
            DanhMucPermission.AddToGroup(group);
        }
    }
    public static class DanhMucPermission
    {
        //Danh mục chung
        public const string Huyen = GroupNameConst.DanhMuc + "Huyen";
        public const string Tinh = GroupNameConst.DanhMuc + "Tinh";
        public const string QuocGia = GroupNameConst.DanhMuc + "QuocGia";
        public const string Xa = GroupNameConst.DanhMuc + "Xa";
        public const string CodeSystem = GroupNameConst.DanhMuc + "CodeSystem";
        public const string SystemConfig = GroupNameConst.DanhMuc + "SystemConfig";
        public const string NhaCungCap = GroupNameConst.DanhMuc + "NhaCungCap";

        public static string[] GetAll()
        {
            return ReflectionHelper.GetPublicConstantsRecursively(typeof(DanhMucPermission));
        }
        public static void AddToGroup(PermissionGroupDefinition group)
        {
            var root = group.AddPermission("DanhMucPermission");
            foreach (var permission in GetAll())
            {
                root.AddChild(permission);
            }
        }
    }
}
