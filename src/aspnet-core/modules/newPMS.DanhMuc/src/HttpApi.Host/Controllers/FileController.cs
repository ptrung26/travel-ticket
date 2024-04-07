using Abp.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using newPMS.DanhMuc.Dto;
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
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Auditing;
using Volo.Abp.BlobStoring;

namespace newPMS.DanhMuc.Controllers
{
    public class FileController : AbpController
    {
        private readonly IOrdAppFactory _factory;
        private readonly IBlobContainerFactory _blobContainerFactory;
        private readonly IConfiguration _configuration;

        public FileController(IOrdAppFactory factory, IBlobContainerFactory blobContainerFactory)
        {
            _factory = factory;
            _blobContainerFactory = blobContainerFactory;
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
        public async Task<FileDto> UploadAnh(int? width, int? height)
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

            //await _blobContainerFactory.Create("MonAn").SaveAsync(outputFile.FileToken, fileBytes, true);
            var gg = await _factory.TempFileCacheManager.GetFileAsync(outputFile.FileToken);
            return outputFile;
        }

        [DisableRequestSizeLimit]
        [HttpPost("api/danh-muc/[controller]/UploadLogo/NhaCungCap/{id}")]
        public async Task<JsonResult> UploadLogoNhaCungCap(long id)
        {
            var lstResult = new List<ResultUpload>();
            var lstFile = Request.Form.Files;
            string basePath = _factory.AppSettingConfiguration.GetSection("FileUploads:RootVolume").Value;
            string folderSave = "DanhMuc/LogoNhaPhanPhoi";
            var pathToSave = Path.Combine(basePath, folderSave);
            var fullPath = "";

            foreach(var file in lstFile)
            {
                var rs = new ResultUpload();
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

                try
                {
                    #region kiểm tra tên file
                    var indexOfPoint = fileName.IndexOf(".");
                    var shortName = fileName.Substring(0, indexOfPoint);
                    var fileType = fileName.Substring(indexOfPoint + 1, (fileName.Length - (indexOfPoint + 1)));
                    List<string> resultFileInfo = shortName.Split('-').ToList();
                    #endregion

                    if (!Directory.Exists(pathToSave))
                    {
                        DirectoryInfo di = Directory.CreateDirectory(pathToSave);
                    }

                    var today = DateTime.Now;
                    var tenLuuTru = $"{today.Year}-{today.Month}-{today.Day}-{today.Hour}-{today.Minute}-{today.Second}-{shortName}.{fileType}";

                    fullPath = Path.Combine(pathToSave, tenLuuTru);
                    var savePath = Path.Combine(folderSave, tenLuuTru);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Dispose();
                        stream.Close();
                    }

                    #region kết quả trả về
                    rs.Name = fileName;
                    rs.FileName = fileName;
                    rs.Status = true;
                    rs.Msg = "Thành công";
                    rs.Path = fullPath.Replace("/home/", "") ;
                    rs.Url = fullPath.Replace("/home/", "") ;
                    rs.Type = fileType;
                    lstResult.Add(rs);
                    #endregion
                }
                catch(UserFriendlyException ufe)
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
                    throw ex;
                }
            }

            //Xóa ảnh cũ
            var urlApi = _factory.AppSettingConfiguration.GetSection("UrlApi").Value;
            return Json(new AjaxResponse(new { lstDataResult = lstResult }));
        }

        [DisableAuditing]
        [HttpGet("api/danh-muc/[controller]/GoToView/{token}")]
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

        //[HttpPost(Utilities.ApiUrlActionBase)]
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

            //var FileBytes = await _factory.TempFileCacheManager.GetFileAsync(outputFile.FileToken)
            return outputFile;
        }

        //[DisableAuditing]
        //[HttpPost("api/file-manager/UploadImage")]
        //public async Task<FileDto> UploadImage(int? width, int? height)
        //{
        //    var file = HttpContext.Request.Form.Files.First();
        //    if (file == null)
        //    {
        //        throw new UserFriendlyException("File_Empty_Error");
        //    }

        //    if (!file.IsImage())
        //    {
        //        throw new UserFriendlyException("File_Not_Img");
        //    }
        //    if (file.Length > 1048576 * 5) //5 MB
        //    {
        //        throw new UserFriendlyException("File_SizeLimit_Error");
        //    }
        //    var outputFile = new FileDto(file.FileName, "application/octet-stream");

        //    if (width.HasValue && height.HasValue)
        //    {
        //        using var image = Image.Load(file.OpenReadStream(), out IImageFormat format);
        //        image.Mutate(x => x.Resize(width.Value, height.Value));
        //        await using var ms = new MemoryStream();
        //        image.Save(ms, format);
        //        await _factory.TempFileCacheManager.SetFileAsync(outputFile, ms.ToArray());
        //        return outputFile;
        //    }

        //    await using var stream = file.OpenReadStream();
        //    var fileBytes = await stream.GetAllBytesAsync();
        //    await _factory.TempFileCacheManager.SetFileAsync(outputFile, fileBytes);
        //    return outputFile;

        //}
        [DisableAuditing]
        //[HttpGet("api/file-manager/GoToViewImage")]
        [HttpGet("api/danh-muc/[controller]/GoToViewImage")]
        public async Task<FileResult> GoToViewImage(string imgName, string blobContainer, string contentType = "image/png")
        {
            try
            {
                var fileObject = await _blobContainerFactory.Create(blobContainer).GetAllBytesOrNullAsync(imgName);
                return File(fileObject, contentType);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lấy ảnh thất bại");
            }
        }

        //[DisableAuditing]
        //[HttpPost("api/file-manager/luu-anh")]
        //public async Task<FileDto> SaveAnh(string token, string blobContainer, string imgName)
        //{
        //    var res = new FileDto
        //    {
        //        FileName = imgName,
        //        FileBytes = await _factory.TempFileCacheManager.GetFileAsync(token),
        //        FileToken = token
        //    };
        //    await _blobContainerFactory.Create(blobContainer).SaveAsync(imgName, res.FileBytes, true);

        //    return res;

        //}
        [DisableAuditing]
        [HttpGet("api/danh-muc/[controller]/taitepdinhkem")]
        public ActionResult TaiTepDinhKem(string url)
        {
            var _tdkRepos = _factory.Repository<TepDinhKemEntity, long>();
            var tdk = _tdkRepos.FirstOrDefault(x => x.DuongDan == url);
            if (tdk != null)
            {
                var downloadPath = Path.Combine(_configuration.GetValue<string>("FileUploads:RootVolume"), url);
                byte[] fileBytes = System.IO.File.ReadAllBytes(downloadPath);
                string fileName = tdk.TenLuuTru;
                string fileType = tdk.DinhDang;
                return File(fileBytes, fileType, fileName);
            }
            else
            {
                throw new UserFriendlyException("Url_Not_Found");
            }
        }
    }
}