using System;
using System.Collections.Generic;

namespace newPMS
{
    public static partial class CommonEnum
    {
        public enum ROLE_LEVEL
        {
            [EnumDisplayString("Khách hàng")]
            KHACH_HANG = 1,

            [EnumDisplayString("Nhân viên")]
            NHAN_VIEN = 3,
        }
        public enum LEVEL
        {
            [EnumDisplayString("ADMIN")]
            ADMIN = 0,
        }

        public static List<ItemObj<ROLE_LEVEL>> GetRolesLevel()
        {
            var _list = new List<ItemObj<ROLE_LEVEL>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(ROLE_LEVEL)))
            {
                _list.Add(new ItemObj<ROLE_LEVEL>
                {
                    Id = (ROLE_LEVEL)iEnumItem,
                    Name = GetEnumDescription((ROLE_LEVEL)iEnumItem)
                });
            }
            return _list;
        }
    }
}