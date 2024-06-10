using Humanizer;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.TourSanPham.Dtos;
using Newtonsoft.Json;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Telerik.Windows.Documents.Spreadsheet.Expressions.Functions;
using Volo.Abp.Application.Dtos;

namespace newPMS.TourSanPham.Request
{
    public class GetTourSanPhamByIdRequest : EntityDto<long>,
         IRequest<CommonResultDto<TourSanPhamDto>>
    {
    }

    public class GetTourSanPhamByIdHandler : IRequestHandler<GetTourSanPhamByIdRequest, CommonResultDto<TourSanPhamDto>>
    {
        private readonly IOrdAppFactory _factory;

        public GetTourSanPhamByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<TourSanPhamDto>> Handle(GetTourSanPhamByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _tourSpRepos = _factory.Repository<TourSanPhamEntity, long>();
                var _chuongTrinhTour = _factory.Repository<ChuongTrinhTourEntity, long>(); 
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var _quocGiaRepos = _factory.Repository<DanhMucQuocGiaEntity, string>().AsNoTracking();
                var _tinhRepos = _factory.Repository<DanhMucTinhEntity, string>().AsNoTracking();
                var result = await _tourSpRepos.GetAsync(request.Id);
                if(result == null)
                {
                    return new CommonResultDto<TourSanPhamDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Tour sản phẩm không tồn tại hoặc đã bị xoá!"
                    };
                }
                var dto = new TourSanPhamDto
                {
                    Id = result.Id,
                    Ma = result.Ma,
                    Ten = result.Ten,
                    LoaiHinhDuLichCode = result.LoaiHinhDuLichCode,
                    LoaiTourCode = result.LoaiTourCode,
                    SoNgay = result.SoNgay,
                    SoDem = result.SoDem,
                    TinhTrang = result.TinhTrang,
                    DiemKhoiHanh = result.DiemKhoiHanh,
                    DiemDen = result.DiemDen,
                    GhiChu = result.GhiChu,
                    QuocGiaId = result.QuocGiaId,
                    TinhId = result.TinhId,
                    TepDinhKemJson = result.TepDinhKemJson,
                    ThanhTienKhoangNguoiJson = result.ThanhTienKhoangNguoiJson,
                    UrlAnhBia = result.UrlAnhBia,
                    ThongTinChung = result.ThongTinChung
                };

                var loaiHinhDuLich = csRepos.FirstOrDefault(x => x.Code == dto.LoaiHinhDuLichCode);
                var loaiTour = csRepos.FirstOrDefault(x => x.Code == dto.LoaiTourCode);
                if (loaiHinhDuLich != null)
                {
                    dto.LoaiHinhDuLichDisplay = loaiHinhDuLich.Display;
                }
                if (loaiTour != null)
                {
                    dto.LoaiTourDisplay = loaiTour.Display;
                }

                var tinh = _tinhRepos.FirstOrDefault(x => x.Id == result.TinhId); 
                if (tinh != null )
                {
                    dto.Tinh = tinh.Ten; 
                }
                var quocGia = _quocGiaRepos.FirstOrDefault(x => x.Id == result.QuocGiaId);
                if (quocGia != null)
                {
                    dto.QuocGia = quocGia.Ten;
                }

                var listDichVuTour = new List<DichVuTour>();
                var chuongTrinhTour = _chuongTrinhTour.Where(x => x.TourSanPhamId == request.Id);

                foreach (var item in chuongTrinhTour)
                {
                    if(!string.IsNullOrEmpty(item.ListDichVuJson))
                    {
                        var dichVuCT = JsonConvert.DeserializeObject<List<string>>(item.ListDichVuJson);

                        foreach (var dv in dichVuCT)
                        {
                            if (listDichVuTour.FirstOrDefault(x => x.DichVuCode == dv) == null)
                            {
                                var dichVu = csRepos.FirstOrDefault(x => dv == x.Code);
                                if (dichVu != null)
                                {
                                    listDichVuTour.Add(new DichVuTour
                                    {
                                        DichVuCode = dichVu.Code,
                                        TenDichVu = dichVu.Display,
                                    });
                                }
                            }
                        }
                    }
                   
                }

                dto.ListDichVu = listDichVuTour; 

                return new CommonResultDto<TourSanPhamDto>
                {
                    IsSuccessful = true,
                    DataResult = dto,
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetById_SANPHAM_TourSP:" + ex.Message);
                return new CommonResultDto<TourSanPhamDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
