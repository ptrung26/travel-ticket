using System;
using Foundatio.Caching;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using OrdBaseApplication.Factory;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Parsing;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Threading;
using newPSG.PMS.Utils;
using Org.BouncyCastle.X509;
using Volo.Abp;
using Stimulsoft.Base.Excel;
using System.Security.Cryptography.Xml;

namespace newPMS
{
    public static class OrdAppFactoryUtil
    {
        #region Get Config

        public static string GetConfig_FileUploadsRootVolume(this IOrdAppFactory factory)
        {
            return factory.AppSettingConfiguration["FileUploads:RootVolume"];
        }



        #endregion

        

        public static async Task<SysUserEntity> GetCurentSysUserAsync(this IOrdAppFactory factory)
        {
            if (factory?.CurrentUser?.Id.HasValue != true)
            {
                return null;
            }
            var queryable = factory.Repository<SysUserEntity, long>().AsNoTracking();
            return await queryable.FirstOrDefaultAsync(x => x.UserId == factory.CurrentUser.Id);
        }


        public static byte[] GetOrAddCacheBytes(this IOrdAppFactory factory, string keyCache, Func<Task<byte[]>> getDataFuncAsync, TimeSpan? expiresIn = null)
        {
            return AsyncHelper.RunSync(() => GetOrAddCacheBytesAsync(factory, keyCache, getDataFuncAsync, expiresIn));
        }
        public static async Task<byte[]> GetOrAddCacheBytesAsync(this IOrdAppFactory factory, string keyCache, Func<Task<byte[]>> getDataFuncAsync, TimeSpan? expiresIn = null)
        {
            var cacheClient = factory.GetServiceDependency<ICacheClient>();
            var cacheDto = await cacheClient.GetAsync<string>(keyCache).ConfigureAwait(false);
            if (cacheDto.HasValue)
            {
                try
                {
                    return Convert.FromBase64String(cacheDto.Value);
                }
                catch
                {
                    //
                }
            }
            var value = await getDataFuncAsync.Invoke();
            expiresIn ??= TimeSpan.FromDays(30);
            await cacheClient.SetAsync(keyCache, Convert.ToBase64String(value), expiresIn).ConfigureAwait(false);
            return value;
        }
    }
}
