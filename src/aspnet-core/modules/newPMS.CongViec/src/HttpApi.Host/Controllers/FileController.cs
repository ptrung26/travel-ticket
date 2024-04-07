using Abp.AspNetZeroCore.Net;
using Abp.Web.Models;
using FlexCel.XlsAdapter;
using Microsoft.AspNetCore.Mvc;
using newPMS.CongViec.Dtos;
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
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using Syncfusion.DocIORenderer;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Parsing;

namespace newPMS.CongViec.Controllers
{
    public class FileController : AbpController
    {
        private readonly IOrdAppFactory _factory;

        public FileController(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [DisableAuditing]
        [HttpGet("api/cong-viec/[controller]/DownloadTempFile/{token}")]
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
        [HttpPost("api/cong-viec/[controller]/UploadAnh")]
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
        [HttpPost("api/cong-viec/[controller]/UploadFile")]
        public async Task<JsonResult> UploadFileAsync()
        {
            var lstResult = new List<ResultUpload>();
            var lstFile = Request.Form.Files;
            string fullPath = "";

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

                    string basePath = _factory.AppSettingConfiguration.GetSection("FileUploads:RootVolume").Value;
                    string folderSave = "File";
                    var pathToSave = Path.Combine(basePath, folderSave);

                    if (!Directory.Exists(pathToSave))
                    {
                        DirectoryInfo di = Directory.CreateDirectory(pathToSave);
                    }

                    var today = DateTime.Now;
                    var tenLuuTru = $"{today.Year}-{today.Month}-{today.Day}-{today.Hour}-{today.Minute}-{today.Second}-{shortName}.{fileType}";

                    fullPath = Path.Combine(pathToSave, tenLuuTru);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    var filePath = Path.Combine(folderSave, tenLuuTru);

                    #region ket qua tra ve
                    rs.Name = fileName;
                    rs.FileName = tenLuuTru;
                    rs.Status = true;
                    rs.Msg = "Thành công";
                    rs.Path = filePath;
                    rs.Url = filePath;
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

            return Json(new AjaxResponse(new { lstDataResult = lstResult }));
        }

        [DisableAuditing]
        [HttpGet("api/cong-viec/[controller]/DownloadFile/{fileName}")]
        public ActionResult DownloadFile(string fileName)
        {
            string basePath = _factory.AppSettingConfiguration.GetSection("FileUploads:RootVolume").Value;
            string folderSave = "File";
            var filePath = Path.Combine(basePath, folderSave, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                throw new UserFriendlyException("Đường dẫn file không tồn tại");
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);

            var fileExtension = fileName.Substring(fileName.LastIndexOf(".") + 1);
            switch (fileExtension)
            {
                case "xlsx":
                    return File(fileBytes, MimeTypeNames.ApplicationVndMsExcel, fileName);
                case "xls":
                    return File(fileBytes, MimeTypeNames.ApplicationVndMsExcel, fileName);
                case "pdf":
                    return File(fileBytes, MimeTypeNames.ApplicationPdf, fileName);
                case "docx":
                    return File(fileBytes, MimeTypeNames.ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument, fileName);
                case "doc":
                    return File(fileBytes, MimeTypeNames.ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument, fileName);
                default:
                    return File(fileBytes, MimeTypeNames.ApplicationVndMsExcel, fileName);
            }
        }

        [DisableAuditing]
        [HttpGet("api/cong-viec/[controller]/GoToViewByFileName/{fileName}")]
        public async Task<FileResult>  GoToViewByFileName(string fileName)
        {
            string basePath = _factory.AppSettingConfiguration.GetSection("FileUploads:RootVolume").Value;
            string folderSave = "File";
            var filePath = Path.Combine(basePath, folderSave, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                throw new UserFriendlyException("Đường dẫn file không tồn tại");
            }
            var fileDto = new FileDto();
            var fileType = Path.GetExtension(filePath);

            fileName = fileName.Replace(fileType, "");
            if (fileType == ".xlsx" || fileType == ".xls")
            {
                var resultXls = new XlsFile(true);
                resultXls.Open(filePath);
                using (FlexCel.Render.FlexCelPdfExport pdf = new FlexCel.Render.FlexCelPdfExport())
                {
                    pdf.Workbook = resultXls;
                    pdf.Workbook.AutoPageBreaks();

                    using (MemoryStream ms = new MemoryStream())
                    {
                        pdf.BeginExport(ms);
                        pdf.ExportAllVisibleSheets(false, "PDF");
                        pdf.EndExport();
                        ms.Position = 0;
                        fileDto = new FileDto($"{fileName}.pdf", "application/pdf");
                        await _factory.TempFileCacheManager.SetFileAsync(fileDto, ms.ToArray());
                        ms.Dispose();
                        ms.Close();
                        pdf.Dispose();
                    }

                }
            }
            else if (fileType == ".doc" || fileType == ".docx")
            {
                FileStream fileStreamPath = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                WordDocument document = new WordDocument(fileStreamPath, FormatType.Automatic);
                DocIORenderer render = new DocIORenderer();
                PdfDocument pdfDocument = render.ConvertToPDF(document);
                render.Dispose();
                document.Dispose();
                MemoryStream outputStream = new MemoryStream();
                pdfDocument.Save(outputStream);
                fileDto = new FileDto($"{fileName}.pdf", MimeTypeNames.ApplicationPdf, true);
                await _factory.TempFileCacheManager.SetFileAsync(fileDto, outputStream.ToArray());
                pdfDocument.Dispose();
                pdfDocument.Close();
                fileStreamPath.Dispose();
                fileStreamPath.Close();
              
            }
            else if (fileType == ".pdf")
            {
                FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                using (PdfLoadedDocument doc = new PdfLoadedDocument(fileStream))
                {
                    MemoryStream outputStream = new MemoryStream();
                    doc.Save(outputStream);
                    fileDto = new FileDto($"{fileName}.pdf", MimeTypeNames.ApplicationPdf, true);
                    await _factory.TempFileCacheManager.SetFileAsync(fileDto, outputStream.ToArray());
                    doc.Dispose();
                    doc.Close();
                    fileStream.Dispose();
                    fileStream.Close();
                }
            }

            var fileBytes = await _factory.TempFileCacheManager.GetFileAsync(fileDto.FileToken);

            return File(fileBytes, fileDto.FileType);
        }
        [DisableAuditing]
        [HttpGet("api/cong-viec/[controller]/GoToView/{token}")]
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
    }
}
