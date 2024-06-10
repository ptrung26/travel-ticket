using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.DichVu.DichVuVe
{
    public class DichVuVeAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        public DichVuVeAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingList")]
        public async Task<PagedResultDto<DichVuVeDto>> PagingList(PagingListDichVuVeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateDichVuVeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetById")]
        public async Task<CommonResultDto<DichVuVeDto>> GetById(GetDichVuVeByIdRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetNhaCungCapDichVuVe")]
        public async Task<CommonResultDto<List<NhaCungCapDichVuVeDto>>> GetNhaCungCapDichVuXe(GetNhaCungCapDichVuVeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

    }
}
