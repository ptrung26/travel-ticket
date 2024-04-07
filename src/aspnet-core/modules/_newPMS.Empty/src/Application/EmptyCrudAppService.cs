using Microsoft.AspNetCore.Mvc;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
namespace newPMS
{
    [Authorize]
    public class EmptyCrudAppService<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput> : CrudAppService<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput>
       where TEntity : class, IEntity<TKey>
       where TEntityDto : IEntityDto<TKey>
   where TGetListInput : IPagedResultRequest
    {
        protected readonly IOrdAppFactory AppFactory;
        protected long BenhVienId => AppFactory.UserSession.BenhVienId ?? -1;
        public EmptyCrudAppService(IOrdAppFactory appFactory) : base(appFactory.Repository<TEntity, TKey>())
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
            ClearCacheAfterUpdateDb();
            input = BeforeSavingEntity(input);
            var dto = await CreateAsync(input);
            return new CommonResultDto<TEntityDto>(dto);
        }

        [HttpPost(Utilities.ApiUrlBase + "Update/{id}")]
        public virtual async Task<CommonResultDto<TEntityDto>> CommonUpdateAsync(TKey id, TCreateInput input)
        {
            ClearCacheAfterUpdateDb();
            input = BeforeSavingEntity(input);
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
        protected virtual TCreateInput BeforeSavingEntity(TCreateInput input)
        {
            return input;
        }
    }
}
