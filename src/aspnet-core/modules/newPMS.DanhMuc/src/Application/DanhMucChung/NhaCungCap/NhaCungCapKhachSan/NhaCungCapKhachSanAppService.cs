using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc.Request;
using newPMS.DanhMucChung.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Services
{
    public class NhaCungCapKhachSanAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        public NhaCungCapKhachSanAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingList")]
        public async Task<PagedResultDto<NhaCungCapKhachSanDto>> PagingList(PagingListNhaCungCapKhachSanRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result; 
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateNhaCungCapKhachSanRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }
    }
}
