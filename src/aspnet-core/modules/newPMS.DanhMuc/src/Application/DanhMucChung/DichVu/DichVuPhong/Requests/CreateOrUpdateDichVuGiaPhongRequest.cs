using MediatR;
using newPMS.DanhMucChung.DichVu.DichVuPhong.Dtos;
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
using Volo.Abp.ObjectMapping;

namespace newPMS.DanhMucChung.DichVu.DichVuPhong.Requests
{
    public class CreateOrUpdateDichVuGiaPhongRequest : CreateOrUpDateDichVuGiaPhongDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateDichVuGiaPhongHandler : IRequestHandler<CreateOrUpdateDichVuGiaPhongRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;

        public CreateOrUpdateDichVuGiaPhongHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateDichVuGiaPhongRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<DichVuGiaPhongEntity, long>();
                if (request.Id > 0)
                {
                    var updateDVX = await _repos.GetAsync(request.Id);
                    if (updateDVX == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Dịch vụ phòng không tồn tại hoặc đã bị xoá",
                        };
                    }

                    _factory.ObjectMapper.Map(request, updateDVX);
                    await _repos.UpdateAsync(updateDVX);
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = request.Id,
                    };
                }
                else
                {
                    var newDVXe = _factory.ObjectMapper.Map<CreateOrUpDateDichVuGiaPhongDto, DichVuGiaPhongEntity>(request);
                    var newId = (await _repos.InsertAsync(newDVXe)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId,
                    };
                }
            }
            catch (Exception ex)
            {
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau"
                };
            }
        }
    }
}
