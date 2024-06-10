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
    public class CreateOrUpdateHangPhongRequest : CreateOrUpdateHangPhongDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateHangPhongHandler : IRequestHandler<CreateOrUpdateHangPhongRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;

        public CreateOrUpdateHangPhongHandler(OrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateHangPhongRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<DichVuHangPhongEntity, long>();
                if (request.Id > 0)
                {
                    var updateDVX = await _repos.GetAsync(request.Id);
                    if (updateDVX == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Dịch vụ hạng phòng không tồn tại hoặc đã bị xoá",
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
                    var newDVXe = _factory.ObjectMapper.Map<CreateOrUpdateHangPhongDto, DichVuHangPhongEntity>(request);
                    var newId = (await _repos.InsertAsync(newDVXe, true)).Id;
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
