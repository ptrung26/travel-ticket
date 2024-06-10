using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Reflection;

namespace newPMS.Permissions
{
    public class KhachKhangGroup : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var group = context.AddGroup("KhachHang");
            KhachHangPermission.AddToGroup(group);
        }
    }
    public static class KhachHangPermission
    {
        //Danh mục chung
        public const string Booking = GroupNameConst.KhachHang + "Booking";

        public static string[] GetAll()
        {
            return ReflectionHelper.GetPublicConstantsRecursively(typeof(KhachHangPermission));
        }
        public static void AddToGroup(PermissionGroupDefinition group)
        {
            var root = group.AddPermission("KhachHangPermission");
            foreach (var permission in GetAll())
            {
                root.AddChild(permission);
            }
        }
    }
}