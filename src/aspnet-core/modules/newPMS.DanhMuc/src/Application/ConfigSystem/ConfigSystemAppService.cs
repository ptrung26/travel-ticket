using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Request;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using newPMS.DanhMuc;

namespace newPMS.NgoaiKiem.Services
{
    public class ConfigSystemAppService : DanhMucCrudAppService<
                                            ConfigSystemEntity,
                                            ConfigSystemDto,
                                            long,
                                            PagingConfigSystemRequest,
                                            ConfigSystemDto>
    {
        public ConfigSystemAppService(IOrdAppFactory appFactory) : base(appFactory)
        {
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public override Task<PagedResultDto<ConfigSystemDto>> GetListAsync(PagingConfigSystemRequest request)
        {
            return AppFactory.Mediator.Send(request);
        }
        [HttpPost(Utilities.ApiUrlBase + "GetByCode/{code}")]
        public async Task<ConfigSystemDto> GetByCode(string code)
        {
            var config = await AppFactory.Repository<ConfigSystemEntity, long>().FirstOrDefaultAsync(x => x.Ma.Equals(code));
            var configDto = AppFactory.ObjectMapper.Map<ConfigSystemEntity, ConfigSystemDto>(config);
            return configDto;
        }
    }
}