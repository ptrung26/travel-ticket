using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.Request;
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

namespace newPMS.DanhMucChung.Request
{
    public class CreateOrUpdateDichVuVeRequest : CreateOrUpdateDichVuVeDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateDichVuVeHandler : IRequestHandler<CreateOrUpdateDichVuVeRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;
        public CreateOrUpdateDichVuVeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateDichVuVeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<DichVuVeEntity, long>();
                if (request.Id > 0)
                {
                    var updateDVX = await _repos.GetAsync(request.Id);
                    if (updateDVX == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Dịch vụ xe không tồn tại hoặc đã bị xoá",
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
                    var newDVXe = _factory.ObjectMapper.Map<CreateOrUpdateDichVuVeDto, DichVuVeEntity>(request);
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
                Console.WriteLine(ex.ToString());
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
