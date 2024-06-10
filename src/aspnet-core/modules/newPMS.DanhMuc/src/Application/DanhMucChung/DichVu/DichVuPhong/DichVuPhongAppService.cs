using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc;
using newPMS.DanhMucChung.DichVu.DichVuPhong.Requests;
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
    public class DichVuPhongAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        public DichVuPhongAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingListHangPhong")]
        public async Task<PagedResultDto<DichVuHangPhongDto>> PagingListHangPhong(PagingListHangPhongRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateHangPhong")]
        public async Task<CommonResultDto<long>> CreateOrUpdateHangPhong(CreateOrUpdateHangPhongRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }


        [HttpPost(Utilities.ApiUrlBase + "GetListGiaPhong")]
        public async Task<PagedResultDto<DichVuGiaPhongDto>> GetListGiaPhong(PagingListGiaPhongRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateDichVuGiaPhong")]
        public async Task<CommonResultDto<long>> CreateOrUpdateDichVuGiaPhong(CreateOrUpdateDichVuGiaPhongRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetComboboxHangPhong")]
        public async Task<CommonResultDto<List<ComboBoxDto>>> GetComboboxHangPhong(GetComboboxHangPhongRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetHangPhongById")]
        public async Task<CommonResultDto<DichVuHangPhongDto>> GetHangPhongById(GetHangPhongByIdRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetGiaPhongById")]
        public async Task<CommonResultDto<DichVuGiaPhongDto>> GetGiaPhongById(GetGiaPhongByIdRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }
    }
}
