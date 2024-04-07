using newPMS.ApplicationShared.Helper;
using OrdBaseApplication.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace newPMS
{
    public static class Utilities
    {
        public const string ApiUrlBase = "api/sanpham/[controller]/";
        public const string ApiUrlActionBase = "api/sanpham/[controller]/[action]";
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
    } 
}
