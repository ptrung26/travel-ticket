using Abp.Application.Services.Dto;
using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.DichVu;
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
    public class GetGiaPhongByIdRequest : EntityDto<long>, IRequest<CommonResultDto<DichVuGiaPhongDto>>
    {
    }

    public class GetGiaPhongByIdHandler : IRequestHandler<GetGiaPhongByIdRequest, CommonResultDto<DichVuGiaPhongDto>>
    {
        private readonly IOrdAppFactory _factory;

        public GetGiaPhongByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<DichVuGiaPhongDto>> Handle(GetGiaPhongByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var hp = await _factory.Repository<DichVuGiaPhongEntity, long>().GetAsync(request.Id);
                var dto = _factory.ObjectMapper.Map<DichVuGiaPhongEntity, DichVuGiaPhongDto>(hp);

                return new CommonResultDto<DichVuGiaPhongDto>
                {
                    IsSuccessful = true,
                    DataResult = dto,
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<DichVuGiaPhongDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau",
                };
            }
        }
    }
}
