using Microsoft.AspNetCore.Mvc;
using newPMS.Avatar;
using newPMS.Avatar.Requests;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Auditing;

namespace newPMS.QuanLyTaiKhoan.Controllers
{
    public class FileController : AbpController
    {
        private readonly IOrdAppFactory _factory;

        public FileController(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [DisableAuditing]
        [HttpGet("api/tai-khoan/[controller]/DownloadTempFile/{token}")]
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
        [HttpPost("api/tai-khoan/[controller]/UploadAnh")]
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

        [DisableAuditing]
        [HttpGet("api/tai-khoan/[controller]/GetAvatar")]
        public async Task<ActionResult> GetAvatar(string userId)
        {
            //UserSessionDto user = _factory.UserSession;
            string folder = _factory.AppSettingConfiguration.GetSection("AvatarBasePath").Value;
            string webRoot = _factory.HostingEnvironment.WebRootPath;
            var _sysUserRepos = _factory.Repository<SysUserEntity, long>();
            var sysUser = _sysUserRepos.FirstOrDefault(x => x.UserId.ToString() == userId);
            string contentType = "image/png"; //kiểu base64
            //Tạo đường dẫn ảnh mặc định
            var pathFinal = Path.Combine(webRoot, "images/no-avatar.png");
            if (sysUser != null)
            {
                //Check file trong folder xem tồn tại hay không?
                var PathFileExist = await _factory.Mediator.Send(new CheckAvatarVersion2Request
                {
                    UserId = userId
                });

                //Nếu có thì gán ảnh
                if (PathFileExist != "")
                {
                    pathFinal = PathFileExist;
                }
            }
            byte[] datafile = await System.IO.File.ReadAllBytesAsync(pathFinal);
            return File(datafile, contentType);
        }

        [DisableAuditing]
        [HttpPost("api/tai-khoan/[controller]/UploadAvatar")]
        public async Task<FileDto> UploadAvatar(int? width, int? height)
        {
           try
            {
                UserSessionDto user = _factory.UserSession;
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
                    //Xoá ảnh avatar nếu đã tồn tại
                    string fileName = user.UserId.ToString() + "." + outputFile.FileName.Split(".")[1];
                    var isExist = await _factory.Mediator.Send(new CheckAvatarRequest { });
                    if (!Directory.Exists(_factory.AppSettingConfiguration.GetSection("AvatarBasePath").Value))
                    {
                        DirectoryInfo di = Directory.CreateDirectory(_factory.AppSettingConfiguration.GetSection("AvatarBasePath").Value);
                    }
                    //Lưu lại ảnh
                    FileStream file1 = new FileStream(Path.Combine(_factory.AppSettingConfiguration.GetSection("AvatarBasePath").Value, fileName), FileMode.Create, FileAccess.Write);
                    ms.WriteTo(file1);
                    file1.Close();
                    //Cập nhật data
                    var _sysUserRepos = _factory.Repository<SysUserEntity, long>();
                    var sysUser = _sysUserRepos.FirstOrDefault(x => x.UserId == user.UserId);
                    if (sysUser != null)
                    {
                        var updateData = await _sysUserRepos.GetAsync(sysUser.Id);
                        updateData.Avatar = fileName;
                        await _sysUserRepos.UpdateAsync(updateData);
                    }
                    await _factory.TempFileCacheManager.SetFileAsync(outputFile, ms.ToArray());
                    ms.Close();
                    return outputFile;
                }

                await using var stream = file.OpenReadStream();
                var fileBytes = await stream.GetAllBytesAsync();
                await _factory.TempFileCacheManager.SetFileAsync(outputFile, fileBytes);
                var gg = await _factory.TempFileCacheManager.GetFileAsync(outputFile.FileToken);
                return outputFile;
            } catch(Exception ex)
            {
                throw;
            }
        }

    }
}
