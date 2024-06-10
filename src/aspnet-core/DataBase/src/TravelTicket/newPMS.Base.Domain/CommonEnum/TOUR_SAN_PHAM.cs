using System;
using System.Collections.Generic;

namespace newPMS
{
    public static partial class CommonEnum
    {
        public enum TRANG_THAI_TOUR_SAN_PHAM
        {
            [EnumDisplayString("Đang hoạt động")]
            DANG_HOAT_DONG = 1,

            [EnumDisplayString("Đã huỷ")]
            DA_HUY = 2,

        }

        public static List<ItemObj<TRANG_THAI_TOUR_SAN_PHAM>> GetTrangThaiTourSanPham()
        {
            var _list = new List<ItemObj<TRANG_THAI_TOUR_SAN_PHAM>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(TRANG_THAI_TOUR_SAN_PHAM)))
            {
                _list.Add(new ItemObj<TRANG_THAI_TOUR_SAN_PHAM>
                {
                    Id = (TRANG_THAI_TOUR_SAN_PHAM)iEnumItem,
                    Name = GetEnumDescription((TRANG_THAI_TOUR_SAN_PHAM)iEnumItem)
                });
            }
            return _list;
        }

       
    }
}