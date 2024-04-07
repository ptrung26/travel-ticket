using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Request;
using newPMS.Entities;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.NgoaiKiem.Services
{
    public class TepDinhKemAppService : DanhMucCrudAppService<
                                            TepDinhKemEntity,
                                            TepDinhKemDto,
                                            long,
                                            PagingTepDinhKemRequest,
                                            TepDinhKemDto>
    {
        public TepDinhKemAppService(IOrdAppFactory appFactory) : base(appFactory)
        {
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public override Task<PagedResultDto<TepDinhKemDto>> GetListAsync(PagingTepDinhKemRequest request)
        {
            return AppFactory.Mediator.Send(request);
        }

        public Task<List<TepDinhKemDto>> GetTepDinhKemByIdDanhMuc(GetTepDinhKemByIdDanhMucRequest request)
        {
            return AppFactory.Mediator.Send(request);
        }
    }
}