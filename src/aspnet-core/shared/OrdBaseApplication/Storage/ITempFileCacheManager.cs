using System;
using System.Threading.Tasks;
using OrdBaseApplication.Dtos;
using Volo.Abp.DependencyInjection;

namespace OrdBaseApplication.Storage
{
    public interface ITempFileCacheManager: ITransientDependency
    {
         Task SetFileAsync(FileDto token, byte[] content);

         Task<byte[]> GetFileAsync(string token);
        Task<byte[]> GetFileAsync(Guid token);
        Task<FileDto> GetFileDtoAsync(string token);
        Task<FileDto> GetFileDtoAsync(Guid token);
    }
}
