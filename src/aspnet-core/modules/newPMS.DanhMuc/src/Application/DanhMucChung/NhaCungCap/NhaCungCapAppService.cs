using MediatR;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Requests;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Services
{
    public class NhaCungCapAppService : DanhMucAppService
    {
        private readonly IMediator _mediator;
        private readonly IOrdAppFactory _factory;
        
        public NhaCungCapAppService(IMediator mediator, IOrdAppFactory factory)
        {
            _mediator = mediator;
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public async Task<PagedResultDto<NhaCungCapDto>> GetListAsync(PagingNhaCungCapRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "InsertOrUpdateNhaCungCap")]
        public async Task<CommonResultDto<bool>> InsertOrUpdateNpp(InsertOrUpdateNhaCungCapRequest req)
        {
            return await _factory.Mediator.Send(req);
        }

        [HttpPost(Utilities.ApiUrlBase + "Delete")]
        public async Task<CommResultErrorDto> Delete(long Id)
        {
            var result = new CommResultErrorDto();
            try
            {
                var _repository = _factory.Repository<NhaCungCapEntity, long>();
                await _repository.DeleteAsync(x => x.Id == Id);

                result.IsSuccessful = true;
            }
            catch(Exception ex)
            {
                result.IsSuccessful = false;
            }
            return result;
        }

        public async Task<FileDto> ExportNhaCungCap(ExportExcelNhaCungCapRequest req)
        {
            return await _factory.Mediator.Send(req);
        }
    }
}
