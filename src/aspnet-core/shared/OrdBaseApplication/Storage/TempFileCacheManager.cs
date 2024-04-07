using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Threading.Tasks;
using OrdBaseApplication.Dtos;
using Volo.Abp.Caching;

namespace OrdBaseApplication.Storage
{
    public class TempFileCacheManager: ITempFileCacheManager
    {
        private readonly IDistributedCache<byte[]> _cache;
        private readonly IDistributedCache<FileDto> _cacheFileDto;
        public TempFileCacheManager(IDistributedCache<byte[]> cache,
            IDistributedCache<FileDto> cacheFileDto)
        {
            _cache = cache;
            _cacheFileDto = cacheFileDto;
        }

        private string GetKey(string token)
        {
            return $"TempFileCacheManager_{token}";
        }
        public async Task SetFileAsync(FileDto fileDto, byte[] content)
        {
            var opt = new DistributedCacheEntryOptions {AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(3)};
            await _cache.SetAsync(this.GetKey(fileDto.FileToken),content, opt);
            await _cacheFileDto.SetAsync("FileDto_" + fileDto.FileToken, fileDto, opt);
        }

        public async Task<byte[]> GetFileAsync(string token)
        {
            var dataCache = await _cache.GetAsync(this.GetKey(token));
            return dataCache;
        }
        public async Task<byte[]> GetFileAsync(Guid token)
        {
            //var dataCache = await _cache.GetAsync(this.GetKey(token.ToString().Replace("-","")));
            var dataCache = await _cache.GetAsync(this.GetKey(token.ToString()));
            return dataCache;
        }

        public async Task<FileDto> GetFileDtoAsync(string token)
        {
            return await _cacheFileDto.GetAsync("FileDto_" + token);
        }
        public async Task<FileDto> GetFileDtoAsync(Guid token)
        {
            //return await _cacheFileDto.GetAsync("FileDto_" + token.ToString().Replace("-", ""));
            return await _cacheFileDto.GetAsync("FileDto_" + token.ToString());
        }

    }
}
