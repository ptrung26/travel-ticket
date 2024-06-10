using MediatR;
using newPMS.Booking.Dtos;
using newPMS.Entities;
using newPMS.Entities.Booking;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.Booking.Request
{
    public class GetDichVuBookingTourRequest : IRequest<CommonResultDto<DichVuBookingTourDto>>
    {
        public long BookingId { get; set; }
    }

    public class GetDichVuBookingTourHandler :
        IRequestHandler<GetDichVuBookingTourRequest, CommonResultDto<DichVuBookingTourDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetDichVuBookingTourHandler(IOrdAppFactory factory)
        {
            _factory = factory; 
        }

        public async Task<CommonResultDto<DichVuBookingTourDto>> Handle(GetDichVuBookingTourRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _bookingTourRepos = _factory.Repository<BookingDichVuTourEntity, long>();
                var _tourRepos = _factory.Repository<TourSanPhamEntity, long>();
                var _ctBookingTourRepos = _factory.Repository<ChiTietBookingDichVuTourEntity, long>();

                var result = (from b in _bookingTourRepos.Where(b => b.Id == request.BookingId)
                              join t in _tourRepos
                              on b.TourId equals t.Id into DichVuTour
                              from dvt in DichVuTour.DefaultIfEmpty()
                              select new DichVuBookingTourDto
                              {
                                  Id = b.Id,
                                  BookingId = b.Id,
                                  DiemDen = b.DiemDen,
                                  GioDon = b.GioDon,
                                  NgayBatDau = b.NgayBatDau,
                                  SoNgay = dvt != null ? dvt.SoNgay : 0,
                                  SoDem = dvt != null ? dvt.SoDem : 0,
                                  SoLuongNguoiLon = b.SoLuongNguoiLon,
                                  SoLuongTreEm = b.SoLuongTreEm,
                                  TenTour = dvt != null ? dvt.Ten : "",
                                  TourId = dvt != null ? dvt.Id : 0,
                              }).FirstOrDefault();

                if (result == null)
                {
                    return new CommonResultDto<DichVuBookingTourDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Booking không tồn tại hoặc đã bị xoá"
                    };
                }

                if(result.Id > 0)
                {
                    var listChiTietDV = _ctBookingTourRepos
                        .Where(x => x.BookingTourId == result.Id).Select(ct =>
                        new ChiTietDichVuBookingTourDto
                        {
                            Id = ct.Id,
                            BookingTourId = result.Id,
                            BookingId = result.BookingId,
                            GiaBan = ct.GiaBan,
                            GiaNett = ct.GiaNett,
                            LoaiDoTuoi = ct.LoaiDoTuoi,
                            SoLuong = ct.SoLuong,
                            ThanhTien = ct.ThanhTien,
                        }).ToList();

                    result.ListChiTiet = listChiTietDV; 
                }

                return new CommonResultDto<DichVuBookingTourDto>
                {
                    IsSuccessful = true,
                    DataResult = result,
                }; 
            } catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
