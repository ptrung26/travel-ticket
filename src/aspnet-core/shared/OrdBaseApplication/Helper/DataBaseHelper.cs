using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Volo.Abp.Application.Dtos;

namespace OrdBaseApplication.Helper
{
    public static class DataBaseHelper
    {
        public static async Task<PagedResultDto<T>> GetPagedAsync<T>(this IQueryable<T> query, int skipCount = 0, int maxResultCount = 10)
        {
            var result = new PagedResultDto<T>
            {
                TotalCount = await query.CountAsync()
            };

            if (result.TotalCount == 0)
            {
                return result;
            }

            result.Items = await query.Skip(skipCount).Take(maxResultCount).ToListAsync();
            return result;
        }

        public static PagedResultDto<T> GetPagedByList<T>(this List<T> lst, int skipCount = 0, int maxResultCount = 10)
        {
            var result = new PagedResultDto<T>
            {
                TotalCount = lst.Count()
            };

            if (result.TotalCount == 0)
            {
                return result;
            }

            result.Items = lst.Skip(skipCount).Take(maxResultCount).ToList();
            return result;
        }
        public static List<T> ConvertArrayJsonToList<T>(this string arrayJson)
        {
            if (string.IsNullOrEmpty(arrayJson)) return null;
            if (arrayJson.First() != '[')
            {
                arrayJson = $"[{arrayJson}]";
            }
            try
            {
                return JsonConvert.DeserializeObject<List<T>>(arrayJson);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
