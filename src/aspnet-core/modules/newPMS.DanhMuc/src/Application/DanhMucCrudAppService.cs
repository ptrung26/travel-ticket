using Microsoft.AspNetCore.Mvc;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using OrdBaseApplication.Dtos;
using System;
using newPMS.DanhMuc;

namespace newPMS
{
    //[Authorize]
    public class DanhMucCrudAppService<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput> : CrudAppService<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput>
       where TEntity : class, IEntity<TKey>
       where TEntityDto : IEntityDto<TKey>
   where TGetListInput : IPagedResultRequest
    {
        protected readonly IOrdAppFactory AppFactory;

        public DanhMucCrudAppService(IOrdAppFactory appFactory) : base(appFactory.Repository<TEntity, TKey>())
        {
            AppFactory = appFactory;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public override Task<PagedResultDto<TEntityDto>> GetListAsync(TGetListInput input)
        {
            var queryDto = this.QueryPagedResult(input);
            if (queryDto == null)
            {
                return base.GetListAsync(input);
            }
            return queryDto.GetPagedAsync<TEntityDto>(input.SkipCount, input.MaxResultCount);

        }
        [HttpGet(Utilities.ApiUrlBase + "GetById/{id}")]
        public override Task<TEntityDto> GetAsync(TKey id)
        {
            return base.GetAsync(id);
        }
        [HttpPost(Utilities.ApiUrlBase + "Create")]
        public virtual async Task<CommonResultDto<TEntityDto>> CommonCreateAsync(TCreateInput input)
        {
            try
            {
                ClearCacheAfterUpdateDb();
                var beforeSavingRet = BeforeSavingEntity(input, true);
                if (!beforeSavingRet.IsSuccessful)
                {
                    return new CommonResultDto<TEntityDto>(beforeSavingRet.ErrorMessage);
                }
                input = beforeSavingRet.DataResult;
                var dto = await CreateAsync(input);
                return new CommonResultDto<TEntityDto>(dto);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost(Utilities.ApiUrlBase + "Update/{id}")]
        public virtual async Task<CommonResultDto<TEntityDto>> CommonUpdateAsync(TKey id, TCreateInput input)
        {
            ClearCacheAfterUpdateDb();
            var beforeSavingRet = BeforeSavingEntity(input,false);
            if (!beforeSavingRet.IsSuccessful)
            {
                return new CommonResultDto<TEntityDto>(beforeSavingRet.ErrorMessage);
            }
            input = beforeSavingRet.DataResult;
            var dto = await UpdateAsync(id,input);
            return new CommonResultDto<TEntityDto>(dto);
        }

        [HttpPost(Utilities.ApiUrlBase + "RemoveById/{id}")]
        public virtual async Task<CommonResultDto<TKey>> CommonDeleteAsync(TKey id)
        {
            ClearCacheAfterUpdateDb();
            await base.DeleteAsync(id);
            return new CommonResultDto<TKey>(dataSuccess: id);
        }

        [HttpPost(Utilities.ApiUrlBase + "GetListToFile")]
        public virtual Task<FileDto> GetListToFileAsync([FromQuery] bool isAll, [FromQuery] int fileType, TGetListInput input)
        {
            return Task.FromResult(
                new FileDto()
            );
        }

        protected virtual IQueryable<TEntityDto> QueryPagedResult(TGetListInput input)
        {
            return null;
        }

        protected virtual void ClearCacheAfterUpdateDb()
        {

        }
        protected virtual CommonResultDto<TCreateInput> BeforeSavingEntity(TCreateInput input, bool isCreate = true)
        {
            return new CommonResultDto<TCreateInput>(dataSuccess:input);
        }
    }
}
