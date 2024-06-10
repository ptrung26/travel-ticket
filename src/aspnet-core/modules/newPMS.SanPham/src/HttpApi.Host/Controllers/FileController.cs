using Abp.AspNetZeroCore.Net;
using Abp.Web.Models;
using Microsoft.AspNetCore.Mvc;
using newPMS.Dto;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Processing;
using Stimulsoft.Base.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
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
        [HttpGet("api/san-pham/[controller]/DownloadTempFile/{token}")]
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
        [HttpGet("api/san-pham/[controller]/GoToViewDoc/{token}")]
        public async Task<FileResult> GoToViewDocument(string token)
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

            return File(fileBytes, fileDto.FileType);
        }

        [DisableAuditing]
        [HttpPost("api/san-pham/[controller]/UploadAnh")]
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

        [DisableRequestSizeLimit]
        [HttpPost("api/san-pham/[controller]/UploadAnhV2")]
        public async Task<JsonResult> UploadHinhAnhV2(string oldFileUrl)
        {
            try
            {
                var lstResult = new List<ResultUpload>();
                var lstFile = Request.Form.Files;
                string fullPath = "";
                string basePath = _factory.AppSettingConfiguration.GetSection("FileUploads:RootVolume").Value;
                string folderSave = "HinhAnh/TourSanPham";
                var pathToSave = Path.Combine(basePath, folderSave);
                var today = DateTime.Now;
                foreach (var file in lstFile)
                {
                    var rs = new ResultUpload();
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

                    try
                    {
                        #region kiem tra ten file                    
                        var indexOfPoint = fileName.IndexOf(".");
                        var shortName = fileName.Substring(0, indexOfPoint);
                        var fileType = fileName.Substring(indexOfPoint + 1, (fileName.Length - (indexOfPoint + 1)));
                        List<string> resultFileInfo = shortName.Split('-').ToList();
                        #endregion

                        if (!Directory.Exists(pathToSave))
                        {
                            DirectoryInfo di = Directory.CreateDirectory(pathToSave);
                        }

                        var tenLuuTru = $"{today.Year}-{today.Month}-{today.Day}-{today.Hour}-{today.Minute}-{today.Second}-{shortName}.{fileType}";

                        fullPath = Path.Combine(pathToSave, tenLuuTru);
                        var token = string.Empty;
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                            stream.Dispose();
                            stream.Close();
                        }
                        var filePath = Path.Combine(folderSave, tenLuuTru);
                        var fileDto = await GetFileDto(Path.Combine(basePath, filePath), fileType);

                        #region ket qua tra ve
                        rs.Name = fileName;
                        rs.FileName = tenLuuTru;
                        rs.Status = true;
                        rs.Msg = "Thành công";
                        rs.Path = filePath;
                        rs.Url = filePath;
                        rs.Token = fileDto.DataResult.FileToken;
                        rs.Type = fileType;
                        lstResult.Add(rs);
                        #endregion
                    }
                    catch (UserFriendlyException ufe)
                    {
                        rs.FileName = fileName;
                        rs.Status = false;
                        rs.Msg = ufe.Message;
                        System.IO.File.Delete(fullPath);
                        lstResult.Add(rs);
                    }
                    catch (Exception ex)
                    {
                        rs.FileName = fileName;
                        rs.Status = false;
                        rs.Msg = "Tệp tải lên không đúng định dạng.";
                        lstResult.Add(rs);
                        System.IO.File.Delete(fullPath);
                    }
                }

                if (!string.IsNullOrEmpty(oldFileUrl) && oldFileUrl.Trim().Length > 0 && System.IO.File.Exists(Path.Combine(basePath, oldFileUrl)))
                {
                    System.IO.File.Delete(Path.Combine(basePath, oldFileUrl));
                }

                return Json(new AjaxResponse(new { lstDataResult = lstResult }));
            }
            catch
            {
                throw;
            }
        }

        public async Task<CommonResultDto<FileDto>> GetFileDto(string path, string fileType)
        {
            try
            {
                var fileName = Path.GetFileName(path);
                var imageFileTypes = new List<string>() { "jpg", "jpeg", "png", "gif", "bmp" };
                fileName = fileName.Replace($".{fileType}", "");

                // Img Type 
                if (imageFileTypes.Contains(fileType.ToLower()))
                {
                    var imageType = "";
                    switch (fileType.ToLower())
                    {
                        case "jpg":
                        case "jpeg":
                            imageType = MimeTypeNames.ImageJpeg;
                            break;
                        case "png":
                            imageType = MimeTypeNames.ImagePng;
                            break;
                    }

                    if (string.IsNullOrEmpty(imageType))
                    {
                        return new CommonResultDto<FileDto>
                        {
                            IsSuccessful = false
                        };
                    }

                    var outputFile = new FileDto($"{fileName}.{fileType}", imageType);
                    await _factory.TempFileCacheManager.SetFileAsync(outputFile, System.IO.File.ReadAllBytes(path));

                    return new CommonResultDto<FileDto>
                    {
                        IsSuccessful = true,
                        DataResult = outputFile
                    };
                }

                return new CommonResultDto<FileDto>
                {
                    IsSuccessful = false
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<FileDto>
                {
                    IsSuccessful = false
                };
            }
        }

        [DisableAuditing]
        [HttpGet("api/san-pham/[controller]/GoToView/{token}")]
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

            return File(fileBytes, fileDto.FileType);
        }
    }


}
