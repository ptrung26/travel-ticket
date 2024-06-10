using MediatR;
using newPMS.Booking.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Uow;

namespace newPMS.Booking.Request
{
    public class CreateOrUpdateBookingRequest : CreateOrUpdateBookingDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateBookingHandler : IRequestHandler<CreateOrUpdateBookingRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;
        public CreateOrUpdateBookingHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateBookingRequest request, CancellationToken cancellationToken)
        {
            var _uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                if (request.Booking.Id > 0)
                {
                    var crudBookingInput = new CreateOrUpdateThongTinBookingRequest();
                    crudBookingInput.Factory = _factory;
                    crudBookingInput.Dto = request.Booking;
                    var booking = await _factory.Mediator.Send(crudBookingInput);
                    if (!booking.IsSuccessful)
                    {
                        await _uow.RollbackAsync();
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Chỉnh sửa thông tin booking thất bại"
                        };
                    }

                    var crudDichVuTourInput = new CreateOrUpdateDichVuBookingTourRequest();
                    crudDichVuTourInput.Factory = _factory;
                    crudDichVuTourInput.Factory = _factory;
                    crudDichVuTourInput.Dto = request.Tour;
                    var dichVuTour = await _factory.Mediator.Send(crudDichVuTourInput);
                    if (!dichVuTour.IsSuccessful)
                    {
                        await _uow.RollbackAsync();
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Chỉnh sửa thông tin booking thất bại"
                        };
                    }

                    await _uow.CompleteAsync();
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = request.Booking.Id,
                    };
                }
                else
                {
                    var crudBookingInput = new CreateOrUpdateThongTinBookingRequest();
                    crudBookingInput.Factory = _factory;
                    crudBookingInput.Dto = request.Booking;
                    var booking = await _factory.Mediator.Send(crudBookingInput);
                    if (!booking.IsSuccessful)
                    {
                        await _uow.RollbackAsync();
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Thêm mới thông tin booking thất bại"
                        };
                    }
                    var newId = booking.DataResult;
                    var crudDichVuTourInput = new CreateOrUpdateDichVuBookingTourRequest();
                    crudDichVuTourInput.Factory = _factory;
                    crudDichVuTourInput.Dto = request.Tour;
                    crudDichVuTourInput.Dto.BookingId = newId;
                    var dichVuTour = await _factory.Mediator.Send(crudDichVuTourInput);
                    if (!dichVuTour.IsSuccessful)
                    {
                        await _uow.RollbackAsync();
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Thêm mới thông tin booking thất bại"
                        };
                    }
                    await _uow.CompleteAsync();

                    if (request.Tour.TourId > 0)
                    {
                        var _tourRepos = _factory.Repository<TourSanPhamEntity, long>();
                        var tour = _tourRepos.FirstOrDefault(x => x.Id == request.Tour.TourId.Value);
                        if (tour == null)
                        {
                            await _uow.RollbackAsync();
                            return new CommonResultDto<long>
                            {
                                IsSuccessful = false,
                                ErrorMessage = "Thêm mới thông tin booking thất bại"
                            };
                        }

                        tour.SoLuongMoBan -= 1;
                        if (tour.SoLuongMoBan == 0)
                        {
                            tour.TinhTrang = 3; // Hết số lượng bám
                        }
                        await _tourRepos.UpdateAsync(tour);
                    }

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
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
