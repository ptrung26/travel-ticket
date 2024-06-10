using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.NhaCungCap.NguoiLienHe.Request;
using newPMS.DanhMucChung.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.NhaCungCap.NguoiLienHe
{
    public class NguoiLienHeAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        public NguoiLienHeAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingList")]
        public async Task<PagedResultDto<NguoiLienHeNCCDto>> PagingList(PagingListNguoiLienHeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateNguoiLienHeNCCRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetById")]
        public async Task<CommonResultDto<NguoiLienHeNCCDto>> CreateOrUpdate(GetNguoiLienByIdRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }
    }
}
