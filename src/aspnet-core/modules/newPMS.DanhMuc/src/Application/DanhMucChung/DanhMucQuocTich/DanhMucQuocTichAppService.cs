using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Services
{
    //[Authorize(DanhMucPermission.QuocGia)]
    public class DanhMucQuocTichAppService : DanhMucCrudAppService<
                                            DanhMucQuocGiaEntity,
                                            QuocTichDto,
                                            string,
                                            PagingQuocTichRequest,
                                            QuocTichDto>
    {
        public DanhMucQuocTichAppService(IOrdAppFactory appFactory) : base(appFactory)
        {
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public override Task<PagedResultDto<QuocTichDto>> GetListAsync(PagingQuocTichRequest request)
        {
            return AppFactory.Mediator.Send(request);
        }

        public async Task<FileDto> ExportExcelQuocTich(ExportQuocTichRequest req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        public async Task<Boolean> IsIdQuocTichExist(string Id, string updateId)
        {
            if (!string.IsNullOrEmpty(updateId))
            {
                // update
                return await Repository.AsNoTracking().AnyAsync(qt => qt.Id == Id && qt.Id != updateId);
            }
            else
            {
                // create
                return await Repository.AsNoTracking().AnyAsync(qt => qt.Id == Id);
            }
        }

        public async Task<List<CheckValidImportExcelQuocTichDto>> CheckValidImportExcelQuocTich(CheckValidImportExcelQuocTichRequest input)
        {
            return await AppFactory.Mediator.Send(input);
        }

        public async Task UploadExcelQuocTich(UploadExcelQuocGiaRequest input)
        {
            await AppFactory.Mediator.Send(input);
        }
    }
}