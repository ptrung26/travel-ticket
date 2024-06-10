using MediatR;
using newPMS.Booking.DichVuLe.Dtos;
using newPMS.Booking.Dtos;
using newPMS.Entities.Booking;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.Booking.DichVuLe.Request
{
    public class CreateOrUpdateDichVuLeRequest : CreateOrUpdateDichVuBookingLeDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateDichVuLeHandler: IRequestHandler<CreateOrUpdateDichVuLeRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory; 
        public CreateOrUpdateDichVuLeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateDichVuLeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<ChiTietBookingDichVuLeEntity, long>(); 
                if(request.Id > 0)
                {
                    var dvLe = _repos.FirstOrDefault(x => x.Id == request.Id);  
                    if(dvLe == null)
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

                } else
                {
                    var dvLe = _factory.ObjectMapper.Map<CreateOrUpdateDichVuBookingLeDto, ChiTietBookingDichVuLeEntity>(request); 
                    var newId = (await _repos.InsertAsync(dvLe, true)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId,
                    };
                }
            } catch(Exception ex)
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
