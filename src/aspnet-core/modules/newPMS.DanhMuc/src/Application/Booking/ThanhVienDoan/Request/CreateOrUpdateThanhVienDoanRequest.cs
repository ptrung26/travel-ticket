using MediatR;
using newPMS.Booking.DichVuLe.Dtos;
using newPMS.Booking.ThanhVienDoan.Dtos;
using newPMS.Entities.Booking;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.ObjectMapping;

namespace newPMS.Booking.ThanhVienDoan.Request
{
    public class CreateOrUpdateThanhVienDoanRequest : ChiTietThanhVienDoanDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateThanhVienDoanHandler : IRequestHandler<CreateOrUpdateThanhVienDoanRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;

        public CreateOrUpdateThanhVienDoanHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateThanhVienDoanRequest request, CancellationToken cancellationToken)
        {
            var _repos = _factory.Repository<ChiTietThanhVienDoanBooking, long>();
            try
            {
                if (request.Id > 0)
                {
                    var dvLe = _repos.FirstOrDefault(x => x.Id == request.Id);
                    if (dvLe == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Dịch vụ lẻ không tồn tại, hoặc đã bị xoá",
                        };
                    }

                    _factory.ObjectMapper.Map(request, dvLe);

                    await _repos.UpdateAsync(dvLe);
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = dvLe.Id,
                    };

                }
                else
                {
                    var dvLe = _factory.ObjectMapper.Map<CreateOrUpdateThanhVienDoanRequest, ChiTietThanhVienDoanBooking>(request);
                    var newId = (await _repos.InsertAsync(dvLe, true)).Id;
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
                    ErrorMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau",
                };
            }
        }
    }
}
