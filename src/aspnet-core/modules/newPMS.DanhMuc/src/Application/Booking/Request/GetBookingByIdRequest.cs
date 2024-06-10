using Abp.Application.Services.Dto;
using MediatR;
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

namespace newPMS.Booking.Request
{
    public class GetBookingByIdRequest : EntityDto<long>, IRequest<CommonResultDto<BookingDto>>
    {
    }

    public class GetBookingByIdHandler : IRequestHandler<GetBookingByIdRequest, CommonResultDto<BookingDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetBookingByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<BookingDto>> Handle(GetBookingByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var booking = await _factory.Repository<BookingEntity, long>().GetAsync(request.Id);
                if(booking == null)
                {
                    return new CommonResultDto<BookingDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Booking không tồn tại hoặc đã bị xoá", 
                    };
                }

                var thongtinChungInput = new GetThongTinBookingChungRequest();
                thongtinChungInput.BookingId = booking.Id;
                var dto = new BookingDto();
                var thongTinChung = await _factory.Mediator.Send(thongtinChungInput); 
                if(!thongTinChung.IsSuccessful)
                {
                    throw new Exception(); 
                }

                var thongTinDichVuTourInput = new GetDichVuBookingTourRequest();
                thongTinDichVuTourInput.BookingId = booking.Id;
                var dvTour = await _factory.Mediator.Send(thongTinDichVuTourInput);
                if (!dvTour.IsSuccessful)
                {
                    throw new Exception();
                }

                dto.ThongTinChung = thongTinChung.DataResult;
                dto.DichVuBookingTour = dvTour.DataResult;

                return new CommonResultDto<BookingDto>
                {
                    IsSuccessful = true,
                    DataResult = dto
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<BookingDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }

        }
    }
}
