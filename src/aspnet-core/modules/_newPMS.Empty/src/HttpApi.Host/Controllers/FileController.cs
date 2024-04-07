using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OrdBaseApplication.Factory;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OrdBaseApplication.Dtos;
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
        [HttpGet(Utilities.ApiUrlBase + "DownloadTempFile/{token}")]
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
        [HttpGet(Utilities.ApiUrlBase + "GoToView/{token}")]
        public async Task<FileResult> GoToView(string token)
        {
            var fileDto = await _factory.TempFileCacheManager.GetFileDtoAsync(token);
            if (fileDto == null)
            {
                throw new AbpException("NotFoundFile");
            }

            var fileBytes = await _factory.TempFileCacheManager.GetFileAsync(token);
            if (fileBytes == null)
            {
                throw new AbpException("NotFoundFile");
            }

            return File(fileBytes, "application/pdf");
        }
        [DisableAuditing]
        [HttpPost(Utilities.ApiUrlBase + "UploadFile/{token}")]
        public async Task<FileDto> UploadFile(string token)
        {
            var file = HttpContext.Request.Form.Files.First();
            if (file == null)
            {
                throw new UserFriendlyException("File_Empty_Error");
            }
            var fileDto = new FileDto()
            {
                FileName = file.FileName,
                FileToken = token, 
                FileType = file.ContentType, 
                FileBytes = await file.GetAllBytesAsync()
            };
            await _factory.TempFileCacheManager.SetFileAsync(fileDto, fileDto.FileBytes);
            return fileDto;
        }
    }
}
