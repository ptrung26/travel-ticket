﻿using System.Collections.Generic;
using System;

namespace newPMS
{
    public static partial class CommonEnum
    {
        public enum LOAI_DANH_MUC
        {
           
        }

        public enum PHAN_VUNG_TINH
        {
            [EnumDisplayString("Tây Nguyên")]
            TAY_NGUYEN = 1,

            [EnumDisplayString("Duyên Hải miền Trung")]
            DUYEN_HAI_MIEN_TRUNG = 2,

            [EnumDisplayString("Đông Nam Bộ")]
            DONG_NAM_BO = 3,

            [EnumDisplayString("Khác")]
            KHAC = 4,
        }

        public enum TRANG_THAI_BOOKING
        {
            [EnumDisplayString("Đang xử lý")]
            DANG_XU_LY = 1,

            [EnumDisplayString("Chờ điều hành")]
            CHO_DIEU_HANH = 1,

            [EnumDisplayString("Điều hành")]
            DIEU_HANH = 2,

            [EnumDisplayString("Đã kết thúc")]
            DA_KET_THUC = 3,

            [EnumDisplayString("Đã huỷ")]
            DA_HUY = 3,
        }

        public static List<ItemObj<PHAN_VUNG_TINH>> GetPhanVungTinh()
        {
            var _list = new List<ItemObj<PHAN_VUNG_TINH>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(PHAN_VUNG_TINH)))
            {
                _list.Add(new ItemObj<PHAN_VUNG_TINH>
                {
                    Id = (PHAN_VUNG_TINH)iEnumItem,
                    Name = GetEnumDescription((PHAN_VUNG_TINH)iEnumItem)
                });
            }
            return _list;
        }

        public static List<ItemObj<TRANG_THAI_BOOKING>> GetTrangThaiBooking()
        {
            var _list = new List<ItemObj<TRANG_THAI_BOOKING>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(TRANG_THAI_BOOKING)))
            {
                _list.Add(new ItemObj<TRANG_THAI_BOOKING>
                {
                    Id = (TRANG_THAI_BOOKING)iEnumItem,
                    Name = GetEnumDescription((TRANG_THAI_BOOKING)iEnumItem)
                });
            }
            return _list;
        }

    }
}