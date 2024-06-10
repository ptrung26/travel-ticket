using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using newPMS.Booking.Dtos;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.NhaCungCap.NhaCungCapVe.Request;
using newPMS.Entities.Booking;
using newPMS.Entities.DanhMuc.NhaCungCap;
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
    public class PagingListBookingRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<ThongTinChungBookingDto>>
    {
        public DateTime? NgayLap { get; set; }
        public long? SysUerId { get; set; }
    }

    public class PagingListBookingHandler : IRequestHandler<PagingListBookingRequest, PagedResultDto<ThongTinChungBookingDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListBookingHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<PagedResultDto<ThongTinChungBookingDto>> Handle(PagingListBookingRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _bookingRepos = _factory.Repository<BookingEntity, long>().AsNoTracking();
                var _khachHangRepos = _factory.Repository<KhachHangEntity, long>().AsNoTracking();
                var _dichVuBookingTourRepos = _factory.Repository<BookingDichVuTourEntity, long>().AsNoTracking();
                var _ctVuBookingLeRepos = _factory.Repository<ChiTietBookingDichVuTourEntity, long>().AsNoTracking();
                var list = (from b in _bookingRepos
                            join k in _khachHangRepos on b.KhachHangId equals k.Id
                            join dvt in _dichVuBookingTourRepos on b.Id equals dvt.BookingId
                            select new ThongTinChungBookingDto
                            {
                                Id = b.Id,
                                Ma = b.Ma, 
                                KhachHangId = b.KhachHangId,
                                TenKhachHang = k.Ten,
                                NgayLap = b.NgayLap,
                                Ten = b.Ten, 
                                TenTour = dvt.TenTour, 
                                SoLuongNguoi = dvt.SoLuongNguoiLon.HasValue ? dvt.SoLuongNguoiLon.Value: 0,
                                KenhBanHang = b.KenhBanHang,
                                GhiChu = b.GhiChu,
                                LoaiKhachHangCode = b.LoaiKhachHangCode,
                                SysUerId = b.SysUerId,
                                SoDienThoai = k.SoDienThoai,
                                DiaChi = k.DiaChi,
                                Email = k.Email,
                                PhuongThucCode = b.PhuongThucCode,
                                TrangThai = b.TrangThai,
                                ThanhTien = b.ThanhTien,
                            }
                            )
                    .WhereIf(!string.IsNullOrEmpty(request.Filter), x => 
                    EF.Functions.Like(x.Ma, request.FilterFullText) ||
                    EF.Functions.Like(x.TenKhachHang, request.FilterFullText) ||
                    EF.Functions.Like(x.Ten, request.FilterFullText))
                    .WhereIf(request.NgayLap.HasValue, x => x.NgayLap == request.NgayLap.Value)
                    .WhereIf(request.SysUerId.HasValue, x => x.SysUerId == request.SysUerId)
                    .ToList();

                foreach (var item in list)
                {
                    item.ThanhTien = _ctVuBookingLeRepos.Where(x => x.BookingId == item.Id).Sum(x => x.GiaBan) * item.SoLuongNguoi; 
                }

                var totalCount = list.AsQueryable().Count();
                var dataGrids = list.AsQueryable().PageBy(request).ToList();

                return new PagedResultDto<ThongTinChungBookingDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }

        }
    }
}

