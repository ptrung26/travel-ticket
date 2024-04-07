using System;
using System.Collections.Generic;

namespace newPMS
{
    public static partial class CommonEnum
    {
        public enum NOTIFICATION
        {
        }
        public static List<ItemObj<NOTIFICATION>> GetNotifications()
        {
            var _list = new List<ItemObj<NOTIFICATION>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(NOTIFICATION)))
            {
                _list.Add(new ItemObj<NOTIFICATION>
                {
                    Id = (NOTIFICATION)iEnumItem,
                    Name = GetEnumDescription((NOTIFICATION)iEnumItem)
                });
            }
            return _list;
        }
    }
}
