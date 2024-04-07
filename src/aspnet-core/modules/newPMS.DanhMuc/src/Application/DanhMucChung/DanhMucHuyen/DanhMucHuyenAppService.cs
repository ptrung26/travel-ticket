using MediatR;
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
    public class DanhMucHuyenAppService : DanhMucCrudAppService<
        DanhMucHuyenEntity,
        HuyenDto,
        string,
        HuyenPagedRequestDto,
        HuyenDto>
    {
        private readonly IMediator _mediator;

        public DanhMucHuyenAppService(IOrdAppFactory appFactory, IMediator mediator) : base(appFactory)
        {
            _mediator = mediator;
        }

        public DanhMucHuyenAppService(IOrdAppFactory appFactory) : base(appFactory)
        {
        }

        protected override IQueryable<HuyenDto> QueryPagedResult(HuyenPagedRequestDto input)
        {
            var textSearch = input.Filter.LikeTextSearch();
            var tinhRepos = AppFactory.Repository<DanhMucTinhEntity, string>().AsNoTracking();

            var query = (from huyen in Repository.AsNoTracking()
                         join tinh in tinhRepos on huyen.TinhId equals tinh.Id
                         select new HuyenDto
                         {
                             Id = huyen.Id,
                             Ten = huyen.Ten,
                             TenEn = huyen.TenEn,
                             TinhId = huyen.TinhId,
                             Cap = huyen.Cap,
                             IsActive = huyen.IsActive,
                             TenTinh = tinh.Ten
                         }).WhereIf(!string.IsNullOrEmpty(input.Filter), p => p.Ten.ToLower().Contains(input.Filter.Trim().ToLower()) || p.Id.Contains(input.Filter.Trim()))
            .WhereIf(!string.IsNullOrEmpty(input.TinhId), x => x.TinhId == input.TinhId)
            .OrderBy(input.Sorting ?? "id asc");

            return query;
        }

        public async Task<List<CheckValidImportExcelDanhMucHuyenDto>> CheckValidImportExcelDanhMucHuyen(CheckValidImportExcelDanhMucHuyenRequest input)
        {
            return await _mediator.Send(input);
        }

        public async Task UploadExcelDanhMucHuyen(UploadExcelDanhMucHuyenRequest input)
        {
            await _mediator.Send(input);
        }

        public async Task<FileDto> ExportExcelDanhMucHuyen(ExportDanhMucHuyenRequest req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        public async Task<Boolean> IsIdHuyenExist(string Id, string updateId)
        {
            if (!string.IsNullOrEmpty(updateId))
            {
                // update
                return await Repository.AsNoTracking().AnyAsync(h => h.Id == Id && h.Id != updateId);
            }
            else
            {
                // create
                return await Repository.AsNoTracking().AnyAsync(h => h.Id == Id);
            }
        }

        public async override Task<CommonResultDto<HuyenDto>> CommonUpdateAsync(string id, HuyenDto input)
        {
            ClearCacheAfterUpdateDb();
            var beforeSavingRet = BeforeSavingEntity(input, true);
            if (!beforeSavingRet.IsSuccessful)
            {
                return new CommonResultDto<HuyenDto>(beforeSavingRet.ErrorMessage);
            }
            var repo = AppFactory.Repository<DanhMucHuyenEntity, string>();

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
                return new CommonResultDto<HuyenDto>(dto);
            }
        }
    }
}