using Abp.Application.Services.Dto;
using Foundatio.Utility;
using Humanizer;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Booking.DichVuLe.Dtos;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.Booking;
using newPMS.Entities.ChietTinh;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.Entities.DichVu;
using Newtonsoft.Json;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.Booking.DichVuLe.Request
{
    public class PagingDichVuLeRequest : PagedFullRequestDto, IRequest<PagedResultDto<ChiTietDichVuLeBookingDto>>
    {
        public long Bookingid { get; set; }
    }

    public class PagingDichVuLeHandler : IRequestHandler<PagingDichVuLeRequest, PagedResultDto<ChiTietDichVuLeBookingDto>>
    {
        private IOrdAppFactory _factory;
        private IRepository<ChiTietBookingDichVuLeEntity, long> _dichVuLeRepos;
        private IRepository<DichVuGiaPhongEntity, long> _dichVuKS;
        private IRepository<DichVuCungCapXeEntity, long> _dichVuXe;
        private IRepository<DichVuVeEntity, long> _dichVuVe;
        private IRepository<NhaCungCapKhachSanEntity, long> _nhaCungCapKS;
        private IRepository<NhaCungCapXeEntity, long> _nhaCungCapXe;
        private IRepository<NhaCungCapVeEntity, long> _nhaCungCapVe;
        private IRepository<ChuongTrinhTourEntity, long> _chuongTrinhTourRepos;
        private IRepository<ChiTietBookingDichVuTourEntity, long> _bookingRepos;
        private IRepository<ChietTinhDichVuXeEntity, long> _chietTinhXeRepos;
        private IRepository<ChietTinhDichVuVeEntity, long> _chietTinhVeRepos;

        public PagingDichVuLeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
            _dichVuLeRepos = _factory.Repository<ChiTietBookingDichVuLeEntity, long>();
            _dichVuKS = _factory.Repository<DichVuGiaPhongEntity, long>();
            _dichVuXe = _factory.Repository<DichVuCungCapXeEntity, long>();
            _dichVuVe = _factory.Repository<DichVuVeEntity, long>();
            _nhaCungCapKS = _factory.Repository<NhaCungCapKhachSanEntity, long>();
            _nhaCungCapXe = _factory.Repository<NhaCungCapXeEntity, long>();
            _nhaCungCapVe = _factory.Repository<NhaCungCapVeEntity, long>();
            _chuongTrinhTourRepos = _factory.Repository<ChuongTrinhTourEntity, long>();
            _bookingRepos = _factory.Repository<ChiTietBookingDichVuTourEntity, long>();
            _chietTinhXeRepos = _factory.Repository<ChietTinhDichVuXeEntity, long>();
            _chietTinhVeRepos = _factory.Repository<ChietTinhDichVuVeEntity, long>();


        }

        public async Task<PagedResultDto<ChiTietDichVuLeBookingDto>> Handle(PagingDichVuLeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var s = _dichVuLeRepos.ToList(); 
                var result = _dichVuLeRepos.Where(x => x.BookingId == request.Bookingid)
                    .Select(x => new ChiTietDichVuLeBookingDto
                    {
                        Id = x.Id,
                        BookingId = x.BookingId,
                        DichVuId = x.DichVuId,
                        NhaCungCapId = x.NhaCungCapId,
                        GhiChu = x.GhiChu,
                        SoLuong = x.SoLuong,
                        DonGia = x.DonGia,
                        ThanhTien = x.ThanhTien,
                        NhaCungCapCode = x.NhaCungCapCode,
                        TrangThai = x.TrangThai,
                        Ngaythu = x.NgayThu.Value, 

                    });

                if (result.ToList().Count == 0)
                {
                    var listCtDVTour = new List<ChiTietDichVuLeBookingDto>();
                    var listDV = await GetDichVuTour(request.Bookingid);

                    var totalCount = listDV.AsQueryable().Count();
                    var dataGrids = listDV.AsQueryable().PageBy(request).ToList();
                    return new PagedResultDto<ChiTietDichVuLeBookingDto>(totalCount, dataGrids);
                }
                else
                {
                    var data = result.ToList();
                    for (int i = 0; i < data.Count; i++)
                    {
                        var item = data[i];
                        if (!string.IsNullOrEmpty(item.NhaCungCapCode))
                        {
                            switch (item.NhaCungCapCode)
                            {
                                case "VeThangCanh":
                                    await GetThongTinhDichVuVe(item);
                                    break;
                                case "XeOto":
                                   await GetThongTinDichVuXe(item);
                                    break;
                            }
                        }

                        data[i] = item;

                    }

                    var totalCount = data.AsQueryable().Count();
                    var dataGrids = data.AsQueryable().PageBy(request).ToList();
                    return new PagedResultDto<ChiTietDichVuLeBookingDto>(totalCount, dataGrids);
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }
        }

        private async Task GetThongTinhDichVuVe(ChiTietDichVuLeBookingDto item)
        {
            var booking =  _bookingRepos.FirstOrDefault(x => x.BookingId == item.BookingId);
            var dichVuVe = (from ctVe in _chietTinhVeRepos
                            join ncc in _nhaCungCapVe on ctVe.NhaCungCapId equals ncc.Id
                            join dv in _dichVuVe on ctVe.DichVuVeId equals dv.Id
                            where ctVe.DichVuVeId == item.DichVuId
                            select new
                            {
                                dv.Id,
                                TenDichVu = dv.Ten,
                                TenNhaCungCap = ncc.Ten,
                                DonGia = dv.GiaNett,
                                SoDienThoai = ncc.Fax,
                                Email = ncc.Email,
                                ctVe.KhoangKhachCode
                            }).FirstOrDefault();

            if (dichVuVe != null)
            {
                item.TenDichVu = dichVuVe.TenDichVu;
                item.TenNhaCungCap = dichVuVe.TenNhaCungCap;
                item.DonGia = dichVuVe.DonGia;
                item.SoDienThoai = dichVuVe.SoDienThoai;
                item.Email = dichVuVe.Email;
                item.KhoangKhachCode = dichVuVe.KhoangKhachCode;
            }

            string soChoDisplay = booking.SoLuong < 10 ? "Cá nhân" : 
                (booking.SoLuong < 10 ? "Đoàn 5 người trở lên" : "Đoàn 10 người trở lên");
            item.SoChoNgoi = soChoDisplay;

        }

        private async Task GetThongTinDichVuXe(ChiTietDichVuLeBookingDto item)
        {
            var booking =  _bookingRepos.FirstOrDefault(x => x.BookingId == item.BookingId);
            var dichVuXe = (from ctXe in _chietTinhXeRepos
                            join ncc in _nhaCungCapXe on ctXe.NhaCungCapId equals ncc.Id
                            join dv in _dichVuXe on ctXe.DichVuXeId equals dv.Id
                            where ctXe.DichVuXeId == item.DichVuId
                            select new
                            {
                                dv.Id,
                                TenDichVu = dv.Ten,
                                TenNhaCungCap = ncc.Ten,
                                DonGia = dv.GiaNett,
                                SoDienThoai = ncc.Fax,
                                Email = ncc.Email,
                                LoaiXe = dv.LoaiXeCode,
                                ctXe.KhoangKhachCode
                            }).FirstOrDefault();

            if (dichVuXe != null)
            {
                item.TenDichVu = dichVuXe.TenDichVu;
                item.TenNhaCungCap = dichVuXe.TenNhaCungCap;
                item.DonGia = dichVuXe.DonGia;
                item.SoDienThoai = dichVuXe.SoDienThoai;
                item.Email = dichVuXe.Email;
                item.LoaiXe = dichVuXe.LoaiXe;
                item.KhoangKhachCode = dichVuXe.KhoangKhachCode;
            }

            string soChoDisplay = booking.SoLuong < 10 ? "4 chỗ" : (booking.SoLuong < 20 ? "10 chỗ" : "20 chỗ");
            item.SoChoNgoi = soChoDisplay; 
        }

        private async Task<List<ChiTietDichVuLeBookingDto>> GetDichVuTour(long bookingId)
        {
            var listCtDVTour = new List<ChiTietDichVuLeBookingDto>();

            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var booking = await _bookingRepos.GetAsync(bookingId);
            var chuongTrinhTour = _chuongTrinhTourRepos.Where(x => x.TourSanPhamId == booking.BookingTourId);
            var listDichVu = new List<DichVuTourDto>();

            foreach (var item in chuongTrinhTour)
            {
                if (!string.IsNullOrEmpty(item.ListDichVuJson))
                {
                    var dichVuCT = JsonConvert.DeserializeObject<List<string>>(item.ListDichVuJson);
                    var dichVuList = csRepos.Where(x => dichVuCT.Contains(x.Code)).ToList();

                    foreach (var dichVu in dichVuList)
                    {
                        if (listDichVu.All(x => x.DichVuCode != dichVu.Code))
                        {
                            listDichVu.Add(new DichVuTourDto
                            {
                                DichVuCode = dichVu.Code,
                                TenDichVu = dichVu.Display,
                            });
                        }
                    }
                }
            }

            string soChoCode = booking.SoLuong < 10 ? "SoCho4" : (booking.SoLuong < 20 ? "SoCho10" : "SoCho20");
            string soChoDisplay = booking.SoLuong < 10 ? "4 chỗ" : (booking.SoLuong < 20 ? "10 chỗ" : "20 chỗ");
            var dichVuCodes = listDichVu.Select(x => x.DichVuCode).ToList();
            if (dichVuCodes.Contains("XeOto"))
            {
                var listDvOto = await (from ctXe in _chietTinhXeRepos
                                       join nccXe in _nhaCungCapXe on ctXe.NhaCungCapId equals nccXe.Id
                                       join dichVuXe in _dichVuXe on ctXe.DichVuXeId equals dichVuXe.Id
                                       where ctXe.TourSanPhamId == booking.BookingTourId
                                       select new ChiTietDichVuLeBookingDto
                                       {
                                           BookingId = booking.BookingId,
                                           DichVuId = ctXe.DichVuXeId,
                                           NhaCungCapCode = "XeOto",
                                           NhaCungCapId = ctXe.NhaCungCapId,
                                           TenNhaCungCap = nccXe.Ten,
                                           TenDichVu = dichVuXe.Ten,
                                           KhoangKhachCode = ctXe.KhoangKhachCode,
                                           Email = nccXe.Email, 
                                           SoDienThoai = nccXe.Fax, 
                                           NhaCungCapDisplay = "Phương tiện di chuyển",
                                           DonGia = dichVuXe.GiaBan, 
                                           Ngaythu = ctXe.NgayThu, 
                                           LoaiXe = dichVuXe.LoaiXeCode,
                                           TrangThai = 1,
                                           SoChoNgoi = soChoDisplay,

                                       }).Where(x => x.KhoangKhachCode == soChoCode).ToListAsync();
                listCtDVTour.AddRange(listDvOto);
            }
            string khoangKhachCode = booking.SoLuong < 5 ? "1Nguoi" : (booking.SoLuong < 10 ? "5Nguoi" : "10Nguoi");
            if (dichVuCodes.Contains("VeThangCanh"))
            {
                var lisstDVVe = await (from ctVe in _chietTinhVeRepos
                                       join nccVe in _nhaCungCapVe on ctVe.NhaCungCapId equals nccVe.Id
                                       join dichVuVe in _dichVuVe on ctVe.DichVuVeId equals dichVuVe.Id
                                       where ctVe.TourSanPhamId == booking.BookingTourId
                                       select new ChiTietDichVuLeBookingDto
                                       {
                                           BookingId = booking.BookingId,
                                           DichVuId = ctVe.DichVuVeId,
                                           NhaCungCapCode = "VeThangCanh",
                                           NhaCungCapDisplay = "Vé thắng cảnh",
                                           NhaCungCapId = ctVe.NhaCungCapId,
                                           TenDichVu = dichVuVe.Ten,
                                           KhoangKhachCode = ctVe.KhoangKhachCode,
                                           TrangThai = 1,
                                           TenNhaCungCap = nccVe.Ten,
                                           Email = nccVe.Email,
                                           SoDienThoai = nccVe.Fax,
                                           Ngaythu = ctVe.NgayThu,
                                       }).Where(x => x.KhoangKhachCode == khoangKhachCode).ToListAsync();
                listCtDVTour.AddRange(lisstDVVe);
            }

            return listCtDVTour;
        }

    }


}
