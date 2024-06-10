using Abp.Application.Services.Dto;
using MediatR;
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

namespace newPMS.DanhMucChung.HopDong
{
    public class HopDongNCCAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
 
        public HopDongNCCAppService(IMediator mediator, IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingListHopDongNCC")]
        public async Task<PagedResultDto<HopDongNCCDto>> PagingListHopDongNCC(PagingListHopDongNCCRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateHopDongNCC")]
        public async Task<CommonResultDto<long>> CreateOrUpdateHopDongNCC(CreateOrUpdateHopDongNCCRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

    }
}

