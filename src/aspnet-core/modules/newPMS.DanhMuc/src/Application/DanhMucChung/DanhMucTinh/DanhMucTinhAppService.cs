using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Request;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Services
{
    //[Authorize(DanhMucPermission.Tinh)]
    public class DanhMucTinhAppService : DanhMucCrudAppService<
                                            DanhMucTinhEntity,
                                            TinhDto,
                                            string,
                                            TinhPagedRequestDto,
                                            TinhDto>
    {
        private readonly IMediator _mediator;

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public string GetMyTest(string input = "Viet")
        {
            return input + "hahah";
        }

        public DanhMucTinhAppService(IOrdAppFactory appFactory, IMediator mediator) : base(appFactory)
        {
            _mediator = mediator;
        }

        public DanhMucTinhAppService(IOrdAppFactory appFactory) : base(appFactory)
        {
        }

        protected override IQueryable<TinhDto> QueryPagedResult(TinhPagedRequestDto input)
        {
            var textSearch = input.Filter.LikeTextSearch();
            var query = Repository.AsNoTracking()
                         .WhereIf(!string.IsNullOrEmpty(input.Filter), p => p.Ten.ToLower().Contains(input.Filter.Trim().ToLower()) || p.Ma.Contains(input.Filter.Trim()))
                         .OrderBy(input.Sorting ?? "id asc");
            if (!string.IsNullOrEmpty(input.Sorting))
            {
                query = query.OrderBy(input.Sorting);
            }
            return query.Select(x => AppFactory.ObjectMapper.Map<DanhMucTinhEntity, TinhDto>(x));
        }

        public async Task<Boolean> IsIdTinhExist(string Id, string updateId)
        {
            if (!string.IsNullOrEmpty(updateId))
            {
                // update
                return await Repository.AsNoTracking().AnyAsync(tinh => tinh.Id == Id && tinh.Id != updateId);
            }
            else
            {
                // create
                return await Repository.AsNoTracking().AnyAsync(tinh => tinh.Id == Id);
            }
        }

        public async Task<Boolean> IsMaTinhExist(string ma, string updateMa)
        {
            if (!string.IsNullOrEmpty(updateMa))
            {
                // update
                return await Repository.AsNoTracking().AnyAsync(tinh => tinh.Ma == ma && tinh.Id != updateMa);
            }
            else
            {
                // create
                return await Repository.AsNoTracking().AnyAsync(tinh => tinh.Ma == ma);
            }
        }

        public async override Task<CommonResultDto<TinhDto>> CommonUpdateAsync(string id, TinhDto input)
        {
            ClearCacheAfterUpdateDb();
            var beforeSavingRet = BeforeSavingEntity(input, true);
            if (!beforeSavingRet.IsSuccessful)
            {
                return new CommonResultDto<TinhDto>(beforeSavingRet.ErrorMessage);
            }
            var repo = AppFactory.Repository<DanhMucTinhEntity, string>();

            if (id != input.Id)
            {
                // Id change !
                // delete => create
                await repo.DeleteAsync(dd => dd.Id == id);
                return await CommonCreateAsync(input);
                // fix relation ?
            }
            else
            {
                var dto = await UpdateAsync(id, input);
                return new CommonResultDto<TinhDto>(dto);
            }
        }

        public async Task<List<CheckValidImportExcelDanhMucTinhDto>> CheckValidImportExcelDanhMucTinh(CheckValidImportExcelDanhMucTinhRequest input)
        {
            return await _mediator.Send(input);
        }

        public async Task UploadExcelDanhMucTinh(UploadExcelDanhMucTinhRequest input)
        {
            await _mediator.Send(input);
        }

        public async Task<FileDto> ExportExcelDanhMucTinh(ExportDanhMucTinhRequest req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        public async Task<CommonResultDto<bool>> ChangeTinhGan(bool check, string maTinh)
        {
            var tinh = await AppFactory.Repository<DanhMucTinhEntity, string>().GetAsync(maTinh);
            if (tinh != null)
            {
                tinh.IsTinhGan = check;
                await AppFactory.Repository<DanhMucTinhEntity, string>().UpdateAsync(tinh);
                return new CommonResultDto<bool>()
                {
                    IsSuccessful = true,
                };
            }
            else
            {
                return new CommonResultDto<bool>()
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại!"
                };
            }
        }

        public async Task<CommonResultDto<bool>> DeleteAll()
        {
            await AppFactory.Repository<DanhMucTinhEntity, string>().DeleteAsync(x => !string.IsNullOrEmpty(x.Id));
            return new CommonResultDto<bool> { IsSuccessful = true };
        }
    }
}