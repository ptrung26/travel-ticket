using Abp.Application.Services.Dto;
using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.DichVu.DichVuPhong.Requests
{
    public class GetHangPhongByIdRequest : EntityDto<long>, IRequest<CommonResultDto<DichVuHangPhongDto>>
    {
    }

    public class GetHangPhongByIdHandler : IRequestHandler<GetHangPhongByIdRequest, CommonResultDto<DichVuHangPhongDto>>
    {
        private readonly IOrdAppFactory _factory; 
        
        public GetHangPhongByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory; 
        }

        public async Task<CommonResultDto<DichVuHangPhongDto>> Handle(GetHangPhongByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var hp = await _factory.Repository<DichVuHangPhongEntity, long>().GetAsync(request.Id);
                var dto = _factory.ObjectMapper.Map<DichVuHangPhongEntity, DichVuHangPhongDto>(hp);

                return new CommonResultDto<DichVuHangPhongDto>
                {
                    IsSuccessful = true,
                    DataResult = dto, 
                };
            } catch(Exception ex)
            {
                return new CommonResultDto<DichVuHangPhongDto>
                {
                    IsSuccessful = false, 
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau", 
                };
            }
        }
    }
}
