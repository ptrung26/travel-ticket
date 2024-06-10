using MediatR;
using Microsoft.AspNetCore.Mvc;
using newPMS.KhachHang.Dtos;
using newPMS.KhachHang.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.KhachHang
{
    public class KhachHangAppService : SanPhamAppService
    {
        private readonly IOrdAppFactory _factory;

        public KhachHangAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public async Task<PagedResultDto<KhachHangDto>> GetListAsync(PagingListKhachHangRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "GetById")]
        public async Task<CommonResultDto<KhachHangDto>> GetById(GetKhachHangByIdRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateKhachHangRequest req)
        {
            return await _factory.Mediator.Send(req);
        }



    }
}
