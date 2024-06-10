using Abp.Application.Services.Dto;
using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.Entities.DichVu;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Request
{
    public class ViewDetailNhaCungCapKhachSanRequest : EntityDto<long>, IRequest<CommonResultDto<NhaCungCapKhachSanDto>>
    {
    }

    public class ViewDetailNhaCungCapKhachSanHandler : IRequestHandler<ViewDetailNhaCungCapKhachSanRequest, CommonResultDto<NhaCungCapKhachSanDto>>
    {

        private readonly IOrdAppFactory _factory; 
        public ViewDetailNhaCungCapKhachSanHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<NhaCungCapKhachSanDto>> Handle(ViewDetailNhaCungCapKhachSanRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _nccKhachSanRepos = _factory.Repository<NhaCungCapKhachSanEntity, long>();
                var _nguoiLienHeRepos = _factory.Repository<NguoiLienHeNCCEntity, long>();
                var _hangPhongRepos = _factory.Repository<DichVuHangPhongEntity, long>();
                var _giaPhongRepos = _factory.Repository<DichVuGiaPhongEntity, long>();
                var ks = await _nccKhachSanRepos.GetAsync(request.Id);

                var listNguoiLienHe = _nguoiLienHeRepos.Where(x => x.NhaCungCapId == request.Id).Select(x => new NguoiLienHeNCCDto
                {
                    Id = x.Id,
                    HoVaTen = x.HoVaTen,
                    ChucVu = x.ChucVu,
                    NhaCungCapId = x.NhaCungCapId,
                    DienThoai = x.DienThoai,
                    Email = x.Email,
                }).ToList();

                var listHangPhong = _hangPhongRepos.Where(x => x.NhaCungCapId == request.Id).Select(x => new DichVuHangPhongDto
                {
                    Id = x.Id,
                    TenHangPhong = x.TenHangPhong, 
                    LoaiPhongCode = x.LoaiPhongCode,
                    NhaCungCapId = x.NhaCungCapId,
                    KichThuocPhong = x.KichThuocPhong,
                    MoTa = x.MoTa,
                    SlPhongFOC = x.SlPhongFOC,
                    SoKhachToiDa = x.SoKhachToiDa,
                    TienIchPhong = x.TienIchPhong,
                    JsonTaiLieu = x.JsonTaiLieu
                }).ToList();

                foreach (var item in listHangPhong)
                {
                    var listGiaPhong = _giaPhongRepos.Where(x => x.HangPhongId == item.Id).Select(x =>
                    new DichVuGiaPhongDto
                    {
                        Id = x.Id,
                        GiaFOTBanNgayLe = x.GiaFOTBanNgayLe,
                        GiaFOTNettNgayLe = x.GiaFOTBanNgayLe,
                        HangPhongId = x.HangPhongId,
                        LoaiPhongCode = x.LoaiPhongCode,
                        NgayApDungDen = x.NgayApDungDen,
                        NgayApDungTu = x.NgayApDungTu,
                        NhaCungCapKhachSanId = item.NhaCungCapId,
                        IsHasThueVAT = x.IsHasThueVAT,
                        LoaiTienTeCode = x.LoaiTienTeCode,
                        TenPhong = x.TenPhong,

                    }).ToList();
                    item.ListDichVuGiaPhong = listGiaPhong;
                }

                var nccKhachSanDto = new NhaCungCapKhachSanDto()
                {
                    Id = ks.Id,
                    Ma = ks.Ma,
                    Ten = ks.Ten,
                    MoTa = ks.MoTa,
                    QuocGiaId = ks.QuocGiaId,
                    TinhId = ks.TinhId,
                    TinhTrang = ks.TinhTrang,
                    SoSao = ks.SoSao,
                    TaiLieuJson = ks.TaiLieuJson,
                    Website = ks.Website,
                    NgayCuoiTuan = ks.NgayCuoiTuan,
                    NgayHetHanHopDong = ks.NgayHetHanHopDong,
                    DiaChi = ks.DiaChi,
                    AnhDaiDienUrl = ks.AnhDaiDienUrl,
                    DichVu = ks.DichVu,
                    Email = ks.Email,
                    LoaiKhachSanCode = ks.LoaiKhachSanCode,
                    Fax = ks.Fax,
                    MaSoThue = ks.MaSoThue,
                    IsHasVAT = ks.IsHasVAT,
                    ListDichVuHangPhong = listHangPhong,
                    ListNguoiLienHeNCC = listNguoiLienHe,
                };

                return new CommonResultDto<NhaCungCapKhachSanDto>
                {
                    IsSuccessful = true,
                    DataResult = nccKhachSanDto,
                };
            } catch(Exception ex)
            {
                Console.WriteLine(ex.Message); 
                return new CommonResultDto<NhaCungCapKhachSanDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!", 
                };
            }
         
        }
    }
}
