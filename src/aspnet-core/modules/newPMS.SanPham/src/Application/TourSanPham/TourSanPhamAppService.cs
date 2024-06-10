using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using newPMS.TourSanPham.Dtos;
using newPMS.TourSanPham.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Abp.AspNetZeroCore.Net;
using newPMS.Entities;
using newPMS.TourSanPham.Request.ChietTinhTour.Request;
using static newPMS.CommonEnum;

namespace newPMS.TourSanPham
{
    public class TourSanPhamAppService : SanPhamAppService
    {
        private readonly IOrdAppFactory _factory;

        public TourSanPhamAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        #region Tour sản phẩm
        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public async Task<PagedResultDto<TourSanPhamDto>> GetListAsync(PagingListTourSanPhamRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "GetById")]
        public async Task<CommonResultDto<TourSanPhamDto>> GetById(GetTourSanPhamByIdRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateTourSanPhamRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [AllowAnonymous]
        public async Task<List<TourSanPhamDto>> GetTop5TourSanPham(GetTop5TourSanPhamRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [AllowAnonymous]
        public async Task<PagedResultDto<TourSanPhamDto>> FilterTourDuLich(FilterTourDuLichRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "HuyTourSanPham")]
        public async Task<CommonResultDto<bool>> HuyTourSanPham(long tourId)
        {
            var _tourRepos = _factory.Repository<TourSanPhamEntity, long>(); 
            var tour = await _tourRepos.GetAsync(tourId);
            tour.TinhTrang = (int)TRANG_THAI_TOUR_SAN_PHAM.DA_HUY;
            await _tourRepos.UpdateAsync(tour);
            return new CommonResultDto<bool>
            {
                IsSuccessful = true
            }; 

        }


        [HttpPost(Utilities.ApiUrlBase + "ViewImage")]
        public async Task<CommonResultDto<FileDto>> ViewImage(string url, string fileType)
        {
            try
            {
                string basePath = _factory.AppSettingConfiguration.GetSection("FileUploads:RootVolume").Value;
                var path = Path.Combine(basePath, url);
                var result = await GetFileDto(path, fileType);
                if (result.IsSuccessful == true)
                {
                    return new CommonResultDto<FileDto>
                    {
                        IsSuccessful = true,
                        DataResult = result.DataResult,

                    };
                }
                return new CommonResultDto<FileDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra!"
                };

            }
            catch
            {
                return new CommonResultDto<FileDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra!"
                };
            }
        }

        [HttpPost(Utilities.ApiUrlBase + "CapNhapSoLuongMoBan")]
        public async Task<CommonResultDto<bool>> CapNhapSoLuongMoBan(CreateOrUpdateSoLuongMoBanTourRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result; 
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
                        DataResult = outputFile,

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

        #endregion

        #region Chương trình Tour

        [HttpPost(Utilities.ApiUrlBase + "GetChuongTrinhTour")]
        public async Task<PagedResultDto<ChuongTrinhTourDto>> GetChuongTrinhTour(PagingListChuongTrinhTourRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateChuongTrinhTour")]
        public async Task<CommonResultDto<long>> CreateOrUpdateChuongTrinhTour(CreateOrUpdateChuongTrinhTourRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "GetChuongTrinhTourById")]
        public async Task<CommonResultDto<ChuongTrinhTourDto>> GetChuongTrinhTourById(GetChuongTrinhTourByIdRequest req)
        {
            return await _factory.Mediator.Send(req);
        }
        #endregion

        #region Chiết Tính 
        // Chiết tính xe 
        [HttpPost(Utilities.ApiUrlBase + "GetListChietTinhXe")]
        public async Task<CommonResultDto<List<ChietTinhXeDto>>> GetListChietTinhXe(GetListChietTinhXeRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateChietTinhXe")]
        public async Task<CommonResultDto<bool>> CreateOrUpdateChietTinhXe(CreateOrUpdateChietTinhXeRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        // Chiết tính ve 
        [HttpPost(Utilities.ApiUrlBase + "GetListChietTinhVe")]
        public async Task<CommonResultDto<List<ChietTinhVeDto>>> GetListChietTinhVe(GetListChietTinhVeRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateChietTinhVe")]
        public async Task<CommonResultDto<bool>> CreateOrUpdateChietTinhVe(CreateOrUpdateChietTinhVeRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        #endregion 

    }
}
