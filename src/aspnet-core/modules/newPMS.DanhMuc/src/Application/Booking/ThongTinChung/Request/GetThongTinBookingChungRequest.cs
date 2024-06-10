using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Booking.Dtos;
using newPMS.Entities;
using newPMS.Entities.Booking;
using newPMS.Entities.KhachHang;
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
    public class GetThongTinBookingChungRequest : IRequest<CommonResultDto<ThongTinChungBookingDto>>
    {
        public long BookingId { get; set; }
    }

    public class GetThongTinBookingChungHandler : IRequestHandler<GetThongTinBookingChungRequest, CommonResultDto<ThongTinChungBookingDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetThongTinBookingChungHandler(IOrdAppFactory factory)
        {
            _factory = factory; 
        }
        public async Task<CommonResultDto<ThongTinChungBookingDto>> Handle(GetThongTinBookingChungRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _bookingRepos = _factory.Repository<BookingEntity, long>().AsNoTracking(); 
                var _khachHangRepos = _factory.Repository<KhachHangEntity, long>().AsNoTracking();
                var _nhanVienRepos = _factory.Repository<SysUserEntity, long>().AsNoTracking();

                var result = (from b in _bookingRepos join kh in _khachHangRepos on b.KhachHangId equals kh.Id
                              join us in _nhanVienRepos on b.NhanVienId equals us.Id
                              select new ThongTinChungBookingDto
                              {
                                  Id = b.Id, 
                                  Ma = b.Ma,
                                  Ten = b.Ten,
                                  KenhBanHang = b.KenhBanHang,
                                  NhanVienId = us.Id,
                                  TenNhanVien = us.HoTen,
                                  GhiChu = b.GhiChu,
                                  LoaiKhachHangCode = b.LoaiKhachHangCode,
                                  KhachHangId = b.KhachHangId,
                                  SysUerId = b.SysUerId, 
                                  TenKhachHang = kh.Ten,
                                  SoDienThoai = kh.SoDienThoai,
                                  DiaChi = kh.DiaChi,
                                  Email = kh.Email,
                                  PhuongThucCode = b.PhuongThucCode, 
                                  NgayLap = b.NgayLap, 
                                  TrangThai = b.TrangThai,
                                  ThanhTien = b.ThanhTien, 
                              }).FirstOrDefault(x => x.Id == request.BookingId); 
                if(result != null)
                {

                    return new CommonResultDto<ThongTinChungBookingDto>()
                    {
                        IsSuccessful = true,
                        DataResult = result,
                    };
                }

                return new CommonResultDto<ThongTinChungBookingDto>()
                {
                    IsSuccessful = false,
                    ErrorMessage = "Booking không tồn tại hoặc đã bị xoá"
                };

            } catch(Exception ex)
            {
                throw new Exception(ex.Message); 
            }
        }
    }
}
