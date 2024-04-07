using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Reflection;

namespace newPMS.Permissions
{
    public class CongViecGroup : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var group = context.AddGroup("CongViec");
            CongViecPermission.AddToGroup(group);
        }
    }
    public static class QuanLyCongViecPermission
    {
        public const string LanhDao = ".LanhDao";
        public const string TruongPhong = ".TruongPhong";
        public const string NhanVien = ".NhanVien";

        public static string[] GetAll()
        {
            return ReflectionHelper.GetPublicConstantsRecursively(typeof(QuanLyCongViecPermission));
        }
    }

    public static class CongViecPermission
    {
        public const string LichCongViec = GroupNameConst.CongViec + "LichCongViec";

        public static string[] GetAll()
        {
            return ReflectionHelper.GetPublicConstantsRecursively(typeof(CongViecPermission));
        }
        public static void AddToGroup(PermissionGroupDefinition group)
        {
            string QuanLyCongViec = GroupNameConst.CongViec + "QuanLyCongViec";

            var root = group.AddPermission("CongViecPermission");
            foreach (var permission in GetAll())
            {
                root.AddChild(permission);
            }

            var quanLyCongViec = root.AddChild(QuanLyCongViec);
            foreach (var crud in QuanLyCongViecPermission.GetAll())
            {
                quanLyCongViec.AddChild(QuanLyCongViec + crud);
            }
        }
    }
}
