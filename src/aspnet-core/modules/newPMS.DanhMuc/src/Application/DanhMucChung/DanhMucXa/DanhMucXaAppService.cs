using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Request;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Services
{
    //[Authorize(DanhMucPermission.Xa)]
    public class DanhMucXaAppService : DanhMucCrudAppService<
                                            DanhMucXaEntity,
                                            XaDto,
                                            string,
                                            PagingXaRequest,
                                            XaDto>
    {
        public DanhMucXaAppService(IOrdAppFactory appFactory) : base(appFactory)
        {
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public override async Task<PagedResultDto<XaDto>> GetListAsync(PagingXaRequest req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        public async Task<Boolean> IsIdXaExist(string Id, string updateId)
        {
            if (!string.IsNullOrEmpty(updateId))
            {
                // update
                return await Repository.AsNoTracking().AnyAsync(xa => xa.Id == Id && xa.Id != updateId);
            }
            else
            {
                // create
                return await Repository.AsNoTracking().AnyAsync(xa => xa.Id == Id);
            }
        }

        #region excel

        public async Task<List<CheckValidImportExcelXaDto>> CheckValidImportExcelNhomThucPham(CheckValidImportExcelXaRequest input)
        {
            return await AppFactory.Mediator.Send(input);
        }

        public async Task UploadExcelXa(UploadExcelXaRequest input)
        {
            await AppFactory.Mediator.Send(input);
        }

        public async Task<FileDto> ExportExcelXa(ExportXaRequest req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        #endregion excel

        #region override

        public async override Task<CommonResultDto<XaDto>> CommonUpdateAsync(string id, XaDto input)
        {
            ClearCacheAfterUpdateDb();
            var beforeSavingRet = BeforeSavingEntity(input, true);
            if (!beforeSavingRet.IsSuccessful)
            {
                return new CommonResultDto<XaDto>(beforeSavingRet.ErrorMessage);
            }
            var repo = AppFactory.Repository<DanhMucXaEntity, string>();

            if (id != input.Id)
            {
                // Id change: delete => create
                await repo.DeleteAsync(dd => dd.Id == id);
                return await CommonCreateAsync(input);
            }
            else
            {
                var dto = await UpdateAsync(id, input);
                return new CommonResultDto<XaDto>(dto);
            }
        }

        protected override CommonResultDto<XaDto> BeforeSavingEntity(XaDto input, bool isCreate = true)
        {
            var huyenRepo = AppFactory.Repository<DanhMucHuyenEntity, string>();
            var tinhRepo = AppFactory.Repository<DanhMucTinhEntity, string>();

            var tinh = tinhRepo.FirstOrDefault(t => t.Id == input.TinhId);
            var huyen = huyenRepo.FirstOrDefault(h => h.Id == input.HuyenId);

            var res = new CommonResultDto<XaDto>();
            res.IsSuccessful = true;

            if (huyen.TinhId != tinh.Id)
            {
                res.IsSuccessful = false;
                res.ErrorMessage = $"Huyện {huyen.Ten} không thuộc tỉnh {tinh.Ten} !";
            }

            input.TenHuyen = huyen.Ten;
            input.TenTinh = tinh.Ten;

            res.DataResult = input;

            return res;
        }

        #endregion override
    }
}