using newPMS.ApplicationShared.Helper;
using OrdBaseApplication.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace newPMS.DanhMuc
{
    public static class Utilities
    {
        private static string[] VietnameseSigns = new string[]
       {

            "aAeEoOuUiIdDyY",

            "áàạảãâấầậẩẫăắằặẳẵ",

            "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",

            "éèẹẻẽêếềệểễ",

            "ÉÈẸẺẼÊẾỀỆỂỄ",

            "óòọỏõôốồộổỗơớờợởỡ",

            "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",

            "úùụủũưứừựửữ",

            "ÚÙỤỦŨƯỨỪỰỬỮ",

            "íìịỉĩ",

            "ÍÌỊỈĨ",

            "đ",

            "Đ",

            "ýỳỵỷỹ",

            "ÝỲỴỶỸ"
       };
        public const string ApiUrlBase = "api/danh-muc/[controller]/";
        public const string ApiUrlActionBase = "api/danh-muc/[controller]/[action]";
        public const string ApiBaseUrl = "api/danh-muc";
        public static List<ComboBoxDto> ConvertListEnumToComboDto(this Type typeObjectEnum)
        {
            var items = CommonEnum.EnumToList(typeObjectEnum);
            return items.Select(x => new ComboBoxDto
            {
                Value = x.Id.ToString(),
                DisplayText = x.Name,
                IsActive = true
            }).ToList();
        }
        public static string RemoveSign4VietnameseString(string str, bool toLower = false)
        {
            for (int i = 1; i < VietnameseSigns.Length; i++)
            {
                for (int j = 0; j < VietnameseSigns[i].Length; j++)
                    str = str.Replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);
            }
            if (toLower)
            {
                return str.ToLower();
            }
            else
            {
                return str;
            }

        }
    } 
}
