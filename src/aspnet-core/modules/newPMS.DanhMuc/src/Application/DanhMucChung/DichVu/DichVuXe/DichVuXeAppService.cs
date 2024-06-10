using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc;
using newPMS.DanhMucChung.DichVu.DichVuXe.Request;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Services
{
    public class DichVuXeAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        public DichVuXeAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingList")]
        public async Task<PagedResultDto<DichVuXeDto>> PagingList(PagingListDichVuXeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateDichVuXeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetById")]
        public async Task<CommonResultDto<DichVuXeDto>> GetById(GetDichVuXeByIdRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetNhaCungCapDichVuXe")]
        public async Task<CommonResultDto<List<NhaCungCapDichVuXeDto>>> GetNhaCungCapDichVuXe(GetNhaCungCapDichVuXeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

    }
}
