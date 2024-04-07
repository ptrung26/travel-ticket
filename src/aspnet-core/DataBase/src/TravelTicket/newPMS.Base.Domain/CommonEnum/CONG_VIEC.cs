using System;
using System.Collections.Generic;

namespace newPMS
{
    public static partial class CommonEnum
    {
        public enum MUC_DO_CONG_VIEC
        {
            [EnumDisplayString("Bình thường")]
            BINH_THUONG = 1,

            [EnumDisplayString("Quan trọng")]
            QUAN_TRONG = 2,

        }

        public static List<ItemObj<MUC_DO_CONG_VIEC>> GetMucDoCongViec()
        {
            var _list = new List<ItemObj<MUC_DO_CONG_VIEC>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(MUC_DO_CONG_VIEC)))
            {
                _list.Add(new ItemObj<MUC_DO_CONG_VIEC>
                {
                    Id = (MUC_DO_CONG_VIEC)iEnumItem,
                    Name = GetEnumDescription((MUC_DO_CONG_VIEC)iEnumItem)
                });
            }
            return _list;
        }

        public enum TRANG_THAI_CONG_VIEC
        {
            [EnumDisplayString("Công việc mới")]
            TAO_MOI = 1,
            [EnumDisplayString("Đang thực hiện")]
            DANG_THUC_HIEN = 2,
            [EnumDisplayString("Chờ phê duyệt")]
            CHO_PHE_DUYET = 3,
            [EnumDisplayString("Phê duyệt")]
            PHE_DUYET = 4,
            [EnumDisplayString("Hoàn thành")]
            HOAN_THANH = 5,
        }

        public static List<ItemObj<TRANG_THAI_CONG_VIEC>> GetTrangThaiCongViec()
        {
            var _list = new List<ItemObj<TRANG_THAI_CONG_VIEC>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(TRANG_THAI_CONG_VIEC)))
            {
                _list.Add(new ItemObj<TRANG_THAI_CONG_VIEC>
                {
                    Id = (TRANG_THAI_CONG_VIEC)iEnumItem,
                    Name = GetEnumDescription((TRANG_THAI_CONG_VIEC)iEnumItem)
                });
            }
            return _list;
        }

        public enum LEVEL_CONG_VIEC
        {
            [EnumDisplayString("Dự án")]
            DU_AN = 0,
            [EnumDisplayString("Công việc")]
            CONG_VIEC = 1,
            [EnumDisplayString("Mục việc nhỏ")]
            MUC_VIEC_NHO = 2,
        }

        public static List<ItemObj<LEVEL_CONG_VIEC>> GetLevelCongViec()
        {
            var _list = new List<ItemObj<LEVEL_CONG_VIEC>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(LEVEL_CONG_VIEC)))
            {
                _list.Add(new ItemObj<LEVEL_CONG_VIEC>
                {
                    Id = (LEVEL_CONG_VIEC)iEnumItem,
                    Name = GetEnumDescription((LEVEL_CONG_VIEC)iEnumItem)
                });
            }
            return _list;
        }

        public enum ROLE_CONG_VIEC
        {
            [EnumDisplayString("Lãnh đạo")]
            LANH_DAO = 0,
            
            [EnumDisplayString("Trưởng phòng")]
            TRUONG_PHONG = 1,

            [EnumDisplayString("Nhân viên")]
            NHAN_VIEN = 2,

            [EnumDisplayString("Cá nhân")]
            CA_NHAN=3, 
        }

        public static List<ItemObj<ROLE_CONG_VIEC>> GetRoleCongViec()
        {
            var _list = new List<ItemObj<ROLE_CONG_VIEC>>();
            foreach (object iEnumItem in Enum.GetValues(typeof(ROLE_CONG_VIEC)))
            {
                _list.Add(new ItemObj<ROLE_CONG_VIEC>
                {
                    Id = (ROLE_CONG_VIEC)iEnumItem,
                    Name = GetEnumDescription((ROLE_CONG_VIEC)iEnumItem)
                });
            }
            return _list;
        }
    }
}