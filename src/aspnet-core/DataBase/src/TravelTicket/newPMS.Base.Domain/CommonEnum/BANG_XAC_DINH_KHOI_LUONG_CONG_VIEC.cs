using System;
using System.Collections.Generic;

namespace newPMS
{
    public static partial class CommonEnum
    {
        public enum BANG_XAC_DINH_KHOI_LUONG_CONG_VIEC
        {
            [EnumDisplayString("Tạo mới")]
            TAO_MOI = 0,

            [EnumDisplayString("Đã gửi")]
            DA_GUI = 1,

            [EnumDisplayString("Đã hủy")]
            DA_HUY = 2,
        }

        public static List<ItemObj<BANG_XAC_DINH_KHOI_LUONG_CONG_VIEC>> GetTrangThaiXacDinhKhoiLuongCongViec()
        {
            var _list = new List<ItemObj<BANG_XAC_DINH_KHOI_LUONG_CONG_VIEC>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(BANG_XAC_DINH_KHOI_LUONG_CONG_VIEC)))
            {
                _list.Add(new ItemObj<BANG_XAC_DINH_KHOI_LUONG_CONG_VIEC>
                {
                    Id = (BANG_XAC_DINH_KHOI_LUONG_CONG_VIEC)iEnumItem,
                    Name = GetEnumDescription((BANG_XAC_DINH_KHOI_LUONG_CONG_VIEC)iEnumItem)
                });
            }
            return _list;
        }
    }
}