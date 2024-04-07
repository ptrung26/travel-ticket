using Microsoft.AspNetCore.Mvc;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Processing;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Auditing;

namespace newPMS.Controllers
{
    public class FileController : AbpController
    {
        private readonly IOrdAppFactory _factory;

        public FileController(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [DisableAuditing]
        [HttpGet("api/danh-muc/[controller]/DownloadTempFile/{token}")]
        public async Task<ActionResult> DownloadTempFile(string token)
        {
            var fileDto = await _factory.TempFileCacheManager.GetFileDtoAsync(token);
            if (fileDto == null)
            {
                return NotFound("RequestedFileDoesNotExists");
            }

            var fileBytes = await _factory.TempFileCacheManager.GetFileAsync(token);
            if (fileBytes == null)
            {
                return NotFound("RequestedFileDoesNotExists");
            }

            return File(fileBytes, fileDto.FileType, fileDto.FileName);
        }
        [DisableAuditing]
        [HttpPost("api/danh-muc/[controller]/UploadAnh")]
        public async Task<FileDto> UploadAnh(int? width,int? height)
        {
            var file = HttpContext.Request.Form.Files.First();
            if (file == null)
            {
                throw new UserFriendlyException("File_Empty_Error");
            }

            if (!file.IsImage())
            {
                throw new UserFriendlyException("File_Not_Img");
            }
            if (file.Length > 1048576 * 5) //5 MB
            {
                throw new UserFriendlyException("File_SizeLimit_Error");
            }
            var outputFile = new FileDto(file.FileName, "application/octet-stream");

            if (width.HasValue && height.HasValue)
            {
                using var image = Image.Load(file.OpenReadStream(), out IImageFormat format);
                image.Mutate(x => x.Resize(width.Value, height.Value));
                await using var ms = new MemoryStream();
                image.Save(ms, format);
                await _factory.TempFileCacheManager.SetFileAsync(outputFile, ms.ToArray());
                return outputFile;
            }

            await using var stream = file.OpenReadStream();
            var fileBytes = await stream.GetAllBytesAsync();
            await _factory.TempFileCacheManager.SetFileAsync(outputFile, fileBytes);
            return outputFile;

        }
        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<FileDto> UploaExcel()
        {
            var file = HttpContext.Request.Form.Files.First();
            if (file == null)
            {
                throw new UserFriendlyException("File_Empty_Error");
            }

            var fileType = file.ContentType;
            var lstInvalidType = new List<string>()
            {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
            if (lstInvalidType.Contains(fileType) == false)
            {
                throw new UserFriendlyException("File_Not_Invalid");
            }
            if (file.Length > 1048576 * 15) //5 MB
            {
                throw new UserFriendlyException("File_SizeLimit_Error");
            }
            var outputFile = new FileDto(file.FileName, file.ContentType);
            await using var stream = file.OpenReadStream();
            var fileBytes = await stream.GetAllBytesAsync();
            await _factory.TempFileCacheManager.SetFileAsync(outputFile, fileBytes);
            return outputFile;

        }
    }
}
