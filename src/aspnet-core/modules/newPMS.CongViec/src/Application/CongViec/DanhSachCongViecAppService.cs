using Abp.Net.Mail;
using Dapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.CongViec.Dtos;
using newPMS.CongViec.Request;
using newPMS.CongViec.Requests;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Stimulsoft.Base.Excel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.TextTemplating;
using static newPMS.CommonEnum;
using static Stimulsoft.Report.StiRecentConnections;

namespace newPMS.CongViec.Services
{
    public class DanhSachCongViecAppService : CongViecAppService
    {
        private readonly IMediator _mediator;
        protected readonly IOrdAppFactory AppFactory;

        public DanhSachCongViecAppService(IOrdAppFactory appFactory, IMediator mediator )
        {
            _mediator = mediator;
            AppFactory = appFactory;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public async Task<PagedResultDto<CongViecDto>> GetListCongViec(PagingCongViecRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "GetListCongViecCaNhan")]
        public async Task<PagedResultDto<CongViecDto>> GetListCongViecCaNhan(PagingCongViecCaNhanRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "DeleteCongViec")]
        public async Task<CommonResultDto<bool>> DeleteCongViec(DeleteCongViecRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateCongViec")]
        public async Task<CommonResultDto<CongViecDto>> CreateOrUpdateCongViec(CreateOrUpdateCongViecRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "GetNhanVienByCongViecId")]
        public async Task<List<CongViecUserDto>> GetNhanVienByCongViecId(GetListUserByCongViecIdRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "GetCongViecById")]
        public async Task<CongViecDto> GetCongViecById(GetCongViecByIdRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateTraoDoiRequest")]
        public async Task<CommonResultDto<bool>> CreateOrUpdateTraoDoiRequest(CreateOrUpdateTraoDoiRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingTraoDoiRequest")]
        public async Task<PagedResultDto<TraoDoiCongViecDto>> PagingTraoDoiRequest(PagingCongViecTraoDoiRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "DeleteTraoDoi")]
        public async Task<CommonResultDto<bool>> DeleteTraoDoi(DeleteTraoDoiCongViecRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingHistory")]
        public async Task<PagedResultDto<CongViecLichSuDto>> PagingHistory(PagingLichSuCongViecRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "SortbySoThuTu")]
        public async Task<bool> SortbySoThuTu(SortBySoThuTuRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateWithHistory")]
        public async Task<CommonResultDto<bool>> CreateOrUpdateWithHistory(CreateOrUpdateAndHistoryRequest req)
        {
            return await _mediator.Send(req);
        }

        [HttpGet(Utilities.ApiUrlBase + "ViewCongViecById/{id}")]
        public async Task<CommonResultDto<CongViecDto>> ViewCongViecById(long id)
        {
            return await AppFactory.Mediator.Send(new ViewCongViecByIdRequest
            {
                CongViecId = id
            });
        }

        [HttpGet(Utilities.ApiUrlBase + "GetAllLichCongViec")]
        public async Task<CommonResultDto<List<CongViecDto>>> GetAllLichCongViec()
        {
            try
            {
                var query = (from cv in AppFactory.Repository<CongViecEntity, long>().Where(x => x.Level == (int)LEVEL_CONG_VIEC.DU_AN)
                             select new CongViecDto
                             {
                                 Id = cv.Id,
                                 Ten = cv.Ten,
                                 MucDo = cv.MucDo,
                                 TrangThai = cv.TrangThai,
                                 NgayBatDau = cv.NgayBatDau,
                                 NgayKetThuc = cv.NgayKetThuc
                             }).ToList();

                return new CommonResultDto<List<CongViecDto>>
                {
                    IsSuccessful = true,
                    DataResult = query
                };
            }
            catch
            {
                return new CommonResultDto<List<CongViecDto>>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra"
                };
            }
        }

        [HttpPost(Utilities.ApiUrlBase + "GetCongViecDangCay")]
        public async Task<CommonResultDto<CongViecDto>> GetCongViecDangCay(GetCongViecDangCayRequest request)
        {
            var result = await _mediator.Send(request);
            return result; 

        }

        [HttpPost(Utilities.ApiUrlBase + "BulkInsertCongViec")]
        public async Task<CommonResultDto<bool>> BulkInsertCongViec(BulkInsertCongViecRequest request)
        {
            var result = await _mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GuiCanhBaoCongViecDenHan")]
        public async Task<CommonResultDto<List<CongViecUserDto>>> GuiCanhBaoCongViecDenHan()
        {
            try
            {

                var query = $@"SELECT 
               cu.SysUserId, cv.Ten, us.HoTen, us.Email,
               cv.NgayKetThuc, cv.NgayHoanThanh, cv.isHoanThanh
               FROM cv_congviecuser cu
               LEFT JOIN sysuser us ON cu.SysUserId = us.Id
               LEFT JOIN cv_congviec cv ON cu.CongViecId = cv.Id AND cv.IsDeleted = 0 AND cv.isHoanThanh = false
               WHERE cu.IsDeleted = 0 AND (DATEDIFF(NgayHoanThanh, CURDATE()) <= 1 OR DATEDIFF(NgayKetThuc, CURDATE()) <= 1)";

                var listDenHan = AppFactory.TravelTicketDbFactory.Connection.Query<CongViecUserDto>($" {query}").ToList();
                foreach (var item in listDenHan)
                {
                    var khoangThoiGian = DateTime.UtcNow - (item.NgayKetThuc ?? DateTime.UtcNow);
                    var khoangThoiGianHoanThanh = DateTime.UtcNow - (item.NgayHoanThanh ?? DateTime.UtcNow);
                    if (khoangThoiGian.TotalDays == 1 || khoangThoiGianHoanThanh.TotalDays == 1)
                    {
                        item.IsDenHan = false;
                    }
                    else if (khoangThoiGian.TotalDays <= 0 || khoangThoiGianHoanThanh.TotalDays <= 0)
                    {
                        item.IsDenHan = false;
                    }

                }

                return new CommonResultDto<List<CongViecUserDto>> {
                    IsSuccessful = true, 
                    DataResult = listDenHan, 
               };

               
            }
            catch (Exception ex)
            {
                return new CommonResultDto<List<CongViecUserDto>>
                {
                    IsSuccessful = true,
                    ErrorMessage = ex.Message,
                };
                throw;
            }
        }
    }
}
