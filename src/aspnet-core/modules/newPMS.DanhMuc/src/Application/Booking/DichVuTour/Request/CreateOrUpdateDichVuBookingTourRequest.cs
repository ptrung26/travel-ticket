using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Booking.DichVuLe.Dtos;
using newPMS.Booking.Dtos;
using newPMS.Entities;
using newPMS.Entities.Booking;
using newPMS.Entities.ChietTinh;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.Entities.DichVu;
using Newtonsoft.Json;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Stimulsoft.Base.Excel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace newPMS.Booking.Request
{
    public class CreateOrUpdateDichVuBookingTourRequest : IRequest<CommonResultDto<long>>
    {
        public IOrdAppFactory Factory { get; set; }
        public CreateOrUpdateDichVuBookingTourDto Dto { get; set; }
    }

    public class CreateOrUpdateDichVuTourHandler : IRequestHandler<CreateOrUpdateDichVuBookingTourRequest, CommonResultDto<long>>
    {
        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateDichVuBookingTourRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _factory = request.Factory;
                var _dvBookingTourRepos = _factory.Repository<BookingDichVuTourEntity, long>();
                var _dvCTBookingTourRepos = _factory.Repository<ChiTietBookingDichVuTourEntity, long>();
                var _dvLeRepos = _factory.Repository<ChiTietBookingDichVuLeEntity, long>();
                var dto = request.Dto;

                if (dto.Id > 0)
                {
                    var updated = await _dvBookingTourRepos.GetAsync(dto.Id);
                    if (updated != null)
                    {
                        _factory.ObjectMapper.Map(dto, updated);
                        await _dvBookingTourRepos.UpdateAsync(updated);
                        if (dto.ListChiTiet.Count > 0)
                        {
                            var listUpdate = new List<ChiTietBookingDichVuTourEntity>();
                            foreach (var item in dto.ListChiTiet)
                            {
                                var ct = await _dvCTBookingTourRepos.GetAsync(item.Id);
                                if (ct == null)
                                {
                                    return new CommonResultDto<long>
                                    {
                                        IsSuccessful = false,
                                        ErrorMessage = "Chi tiết dịch vụ booking tour không tồn tại hoặc đã bị xoá",
                                    };
                                }
                                else
                                {
                                    _factory.ObjectMapper.Map(item, ct);

                                    listUpdate.Add(ct);

                                }
                            }

                            await _dvCTBookingTourRepos.UpdateManyAsync(listUpdate);
                        }

                        // Cập nhật dịch vụ lẻ
                        var listDVLe = _dvLeRepos.Where(x => x.BookingId == dto.BookingId);
                        if (listDVLe.ToList().Count == 0)
                        {
                            var listDV = await GetDichVuTour(request);
                            var listEntity = new List<ChiTietBookingDichVuLeEntity>();

                            foreach (var it in listDV)
                            {
                                var entity = _factory.ObjectMapper.Map<ChiTietDichVuLeBookingDto, ChiTietBookingDichVuLeEntity>(it);
                                listEntity.Add(entity);
                            }

                            await _dvLeRepos.InsertManyAsync(listEntity);

                        }

                        return new CommonResultDto<long>
                        {
                            IsSuccessful = true,
                            DataResult = updated.Id,
                        };
                    }
                    else
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Dịch vụ booking tour không tồn tại hoặc đã bị xoá",
                        };
                    }
                }
                else
                {
                    var insert = new BookingDichVuTourEntity();
                    _factory.ObjectMapper.Map(request.Dto, insert);
                    var newId = (await _dvBookingTourRepos.InsertAsync(insert, true)).Id;
                    if (dto.ListChiTiet.Count > 0)
                    {
                        var listInsert = new List<ChiTietBookingDichVuTourEntity>();
                        foreach (var item in dto.ListChiTiet)
                        {
                            var ct = new ChiTietBookingDichVuTourEntity();
                            _factory.ObjectMapper.Map(item, ct);
                            ct.BookingId = dto.BookingId;
                            ct.BookingTourId = newId;
                            listInsert.Add(ct);
                        }

                        await _dvCTBookingTourRepos.InsertManyAsync(listInsert);
                    }
                    var listDVLe = _dvLeRepos.Where(x => x.BookingId == dto.BookingId);
                    if (listDVLe.ToList().Count == 0)
                    {
                        var listDV = await GetDichVuTour(request);
                        var listEntity = new List<ChiTietBookingDichVuLeEntity>();

                        foreach (var it in listDV)
                        {
                            var entity = _factory.ObjectMapper.Map<ChiTietDichVuLeBookingDto, ChiTietBookingDichVuLeEntity>(it);
                            listEntity.Add(entity);
                        }

                        await _dvLeRepos.InsertManyAsync(listEntity);

                    }
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId
                    };
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private async Task<List<ChiTietDichVuLeBookingDto>> GetDichVuTour(CreateOrUpdateDichVuBookingTourRequest request)
        {
            var listCtDVTour = new List<ChiTietDichVuLeBookingDto>();
            var dto = request.Dto;

            var _factory = request.Factory;
            var _chuongTrinhTourRepos = _factory.Repository<ChuongTrinhTourEntity, long>();
            var _chietTinhXeRepos = _factory.Repository<ChietTinhDichVuXeEntity, long>();
            var _chietTinhVeRepos = _factory.Repository<ChietTinhDichVuVeEntity, long>();
            var _nhaCungCapXe = _factory.Repository<NhaCungCapXeEntity, long>();
            var _dichVuXe = _factory.Repository<DichVuCungCapXeEntity, long>();
            var _nhaCungCapVe = _factory.Repository<NhaCungCapVeEntity, long>();
            var _dichVuVe = _factory.Repository<DichVuVeEntity, long>();
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();


            var chuongTrinhTour = _chuongTrinhTourRepos
                .Where(x => x.TourSanPhamId == dto.TourId);
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

            string soChoCode = dto.SoLuongNguoiLon < 10 ? "SoCho4" : (dto.SoLuongNguoiLon < 20 ? "SoCho10" : "SoCho20");
            var dichVuCodes = listDichVu.Select(x => x.DichVuCode).ToList();
            if (dichVuCodes.Contains("XeOto"))
            {
                var listDvOto = await (from ctXe in _chietTinhXeRepos
                                       join nccXe in _nhaCungCapXe on ctXe.NhaCungCapId equals nccXe.Id
                                       join dichVuXe in _dichVuXe on ctXe.DichVuXeId equals dichVuXe.Id
                                       where ctXe.TourSanPhamId == request.Dto.TourId
                                       select new ChiTietDichVuLeBookingDto
                                       {
                                           BookingId = dto.BookingId,
                                           DichVuId = ctXe.DichVuXeId,
                                           NhaCungCapCode = "XeOto",
                                           NhaCungCapId = ctXe.NhaCungCapId,
                                           TenDichVu = dichVuXe.Ten,
                                           KhoangKhachCode = ctXe.KhoangKhachCode,
                                           TrangThai = 1,
                                           Ngaythu = ctXe.NgayThu,
                                           PhuongThucCode = "ChuyenKhoan"

                                       }).Where(x => x.KhoangKhachCode == soChoCode).ToListAsync();
                listCtDVTour.AddRange(listDvOto);
            }


            string khoangKhachCode = dto.SoLuongNguoiLon < 5 ? "1Nguoi" : (dto.SoLuongNguoiLon < 10 ? "5Nguoi" : "10Nguoi");
            if (dichVuCodes.Contains("VeThangCanh"))
            {
                var lisstDVVe = await (from ctVe in _chietTinhVeRepos
                                       join nccVe in _nhaCungCapVe on ctVe.NhaCungCapId equals nccVe.Id
                                       join dichVuVe in _dichVuVe on ctVe.DichVuVeId equals dichVuVe.Id
                                       where ctVe.TourSanPhamId == request.Dto.TourId
                                       select new ChiTietDichVuLeBookingDto
                                       {
                                           BookingId = dto.BookingId,
                                           DichVuId = ctVe.DichVuVeId,
                                           NhaCungCapCode = "VeThangCanh",
                                           NhaCungCapId = ctVe.NhaCungCapId,
                                           TenDichVu = dichVuVe.Ten,
                                           KhoangKhachCode = ctVe.KhoangKhachCode,
                                           TrangThai = 1,
                                           Ngaythu = ctVe.NgayThu,
                                           PhuongThucCode = "ChuyenKhoan"
                                       }).Where(x => x.KhoangKhachCode == khoangKhachCode).ToListAsync();
                listCtDVTour.AddRange(lisstDVVe);
            }
            return listCtDVTour;
        }
    }


}
