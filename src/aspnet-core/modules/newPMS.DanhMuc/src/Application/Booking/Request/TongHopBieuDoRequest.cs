using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Booking.Dtos;
using newPMS.Entities.Booking;
using newPMS.Entities.KhachHang;
using NUglify.Helpers;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static Stimulsoft.Report.StiRecentConnections;

namespace newPMS.Booking.Request
{
    public class TongHopBieuDoRequest : IRequest<CommonResultDto<TongHopBieuDoDto>>
    {
        public int? Nam { get; set; }
    }

    public class TongHopBieuDoHandler: IRequestHandler<TongHopBieuDoRequest, CommonResultDto<TongHopBieuDoDto>>
    {
        private readonly IOrdAppFactory _factory; 

        public TongHopBieuDoHandler(IOrdAppFactory factory)
        {
            _factory = factory; 
        }

        public async Task<CommonResultDto<TongHopBieuDoDto>> Handle(TongHopBieuDoRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _khachHangRepos = _factory.Repository<KhachHangEntity, long>().AsNoTracking();
                var _bookingRepos = _factory.Repository<BookingEntity, long>().AsNoTracking();
                var _dichVuBookingTourRepos = _factory.Repository<BookingDichVuTourEntity, long>().AsNoTracking();
                var _ctVuBookingLeRepos = _factory.Repository<ChiTietBookingDichVuTourEntity, long>().AsNoTracking();

                var soLuongKhachHang = await _khachHangRepos.Where(x => !x.IsDeleted).CountAsync();
                var soLuongBooking = await _bookingRepos.Where(x => !x.IsDeleted).CountAsync();

                if(!request.Nam.HasValue)
                {
                    request.Nam = DateTime.UtcNow.Year; 
                }
                var allBookings = from ct in _ctVuBookingLeRepos
                                  join b in _bookingRepos on ct.BookingId equals b.Id
                                  where b.IsDeleted != true && b.TrangThai != 5
                                  select new
                                  {
                                      NgayLap = b.NgayLap.Value,
                                      ct.GiaBan
                                  };

                var doanhThuTheoThang = new Dictionary<int, decimal>();

                decimal tongDoanhThu = 0;

                foreach (var booking in allBookings)
                {
                    int month = booking.NgayLap.Month;
                    if (!doanhThuTheoThang.ContainsKey(month))
                    {
                        doanhThuTheoThang[month] = 0;
                    }
                    doanhThuTheoThang[month] += booking.GiaBan;
                    tongDoanhThu += booking.GiaBan;
                }

                var listDoanhThuTheoThang = new List<DoanhThuTheoThang>();
                for (int thang = 1; thang <= 12; thang++)
                {
                    listDoanhThuTheoThang.Add(new DoanhThuTheoThang
                    {
                        Thang = thang,
                        DoanhThu = doanhThuTheoThang.ContainsKey(thang) ? doanhThuTheoThang[thang] : 0
                    });
                }

                var dto = new TongHopBieuDoDto()
                {
                    SoLuongBooking = soLuongBooking,
                    SoLuongKhachHang = soLuongKhachHang, 
                    TongDoanhThu = tongDoanhThu, 
                    ListDoanhThuTheoThang = listDoanhThuTheoThang, 
                };

                return new CommonResultDto<TongHopBieuDoDto>
                {
                    IsSuccessful = true,
                    DataResult = dto,
                }; 

            }
            catch (Exception ex)
            {
                return new CommonResultDto<TongHopBieuDoDto>()
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau"
                }; 
            }
        }
    }

}
