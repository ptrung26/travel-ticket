using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc.Request;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.NhaCungCap.NhaCungCapVe.Request;
using newPMS.DanhMucChung.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Services
{
    public class NhaCungCapVeAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        public NhaCungCapVeAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingList")]
        public async Task<PagedResultDto<NhaCungCapVeDto>> PagingList(PagingListNhaCungCapVeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result; 
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateNhaCungCapVeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetById")]
        public async Task<CommonResultDto<NhaCungCapVeDto>> GetById(GetNCCVeByIdRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }
    }
}
