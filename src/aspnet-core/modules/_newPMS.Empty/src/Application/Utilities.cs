using newPMS.ApplicationShared.Helper;
using newPMS.CommonEnum;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;

namespace newPMS
{
    public static class Utilities
    {
        public const string ApiUrlBase = "api/empty/[controller]/";
        public static List<ComboBoxDto> ConvertListEnumToComboDto(this Type typeObjectEnum)
        {
            var items = CommonENum.EnumToList(typeObjectEnum);
            return items.Select(x => new ComboBoxDto
            {
                Value = x.Id.ToString(),
                DisplayText = x.Name,
                IsActive = true
            }).ToList();
        }

        public static IQueryable<T> WhereBenhVienIdCurrent<T>(this IQueryable<T> query, IOrdAppFactory factory)
            where T : IMustBenhVienId
        {
            return SharedQueryable.WhereBenhVienIdCurrent(query, factory);
        }

        /// <summary>
        /// Sử dụng để query cho các loại danh mục có cấu hình từ huyện xuống đến xã
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="factory"></param>
        /// <returns></returns>
        public static IQueryable<T> WhereBenhVienHienTaiHoacCapCha<T>(this IQueryable<T> query, IOrdAppFactory factory)
            where T : IMustBenhVienId
        {
            return SharedQueryable.WhereBenhVienHienTaiHoacCapCha(query, factory);
        }
    }
}
