using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.TourSanPham.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using static newPMS.CommonEnum;

namespace newPMS.TourSanPham.Request
{
    public class FilterTourDuLichRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<TourSanPhamDto>>
    {
        public string QuocGiaId { get; set; }
        public string TinhId { get; set; }
    }

    public class FilterTourDuLichHandler : IRequestHandler<FilterTourDuLichRequest, PagedResultDto<TourSanPhamDto>>
    {
        private readonly IOrdAppFactory _factory;

        public FilterTourDuLichHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<PagedResultDto<TourSanPhamDto>> Handle(FilterTourDuLichRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _tourSpRepos = _factory.Repository<TourSanPhamEntity, long>()
                    .Where(x => x.SoLuongMoBan > 0 && x.TinhTrang != (int)TRANG_THAI_TOUR_SAN_PHAM.DA_HUY)
                    .AsNoTracking();
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var _quocGiaRepos = _factory.Repository<DanhMucQuocGiaEntity, string>().AsNoTracking();
                var _tinhRepos = _factory.Repository<DanhMucTinhEntity, string>().AsNoTracking();
                var result = (from t in _tourSpRepos
                              select new TourSanPhamDto
                              {
                                  Id = t.Id,
                                  Ma = t.Ma,
                                  Ten = t.Ten,
                                  LoaiHinhDuLichCode = t.LoaiHinhDuLichCode,
                                  LoaiTourCode = t.LoaiTourCode,
                                  SoNgay = t.SoNgay,
                                  SoDem = t.SoDem,
                                  TinhTrang = t.TinhTrang,
                                  ThanhTienKhoangNguoiJson = t.ThanhTienKhoangNguoiJson,
                                  UrlAnhBia = t.UrlAnhBia,
                                  QuocGiaId = t.QuocGiaId,
                                  DiemDen = t.DiemDen,
                                  TinhId = t.TinhId,
                              })
                              .WhereIf(!string.IsNullOrEmpty(request.Filter),
                              x =>
                              EF.Functions.Like(x.Ten, request.FilterFullText) || EF.Functions.Like(x.Ma, request.FilterFullText))
                              .WhereIf(!string.IsNullOrEmpty(request.QuocGiaId),
                              x =>  x.QuocGiaId == request.QuocGiaId)
                              .WhereIf(!string.IsNullOrEmpty(request.TinhId),
                              x =>  x.TinhId == request.TinhId);

                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);
                for (int i = 0; i < dataGrids.Count; i++)
                {
                    var item = dataGrids[i];
                    var loaiHinhDuLich = csRepos.FirstOrDefault(x => x.Code == dataGrids[i].LoaiHinhDuLichCode);
                    var loaiTour = csRepos.FirstOrDefault(x => x.Code == dataGrids[i].LoaiTourCode);

                    if (loaiHinhDuLich != null)
                    {
                        dataGrids[i].LoaiHinhDuLichDisplay = loaiHinhDuLich.Display;
                    }
                    if (loaiTour != null)
                    {
                        dataGrids[i].LoaiTourDisplay = loaiTour.Display;
                    }

                    var tinh = _tinhRepos.FirstOrDefault(x => x.Id == item.TinhId);
                    if (tinh != null)
                    {
                        item.Tinh = tinh.Ten;
                    }
                    var quocGia = _quocGiaRepos.FirstOrDefault(x => x.Id == item.QuocGiaId);
                    if (quocGia != null)
                    {
                        item.QuocGia = quocGia.Ten;
                    }
                }

                return new PagedResultDto<TourSanPhamDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }
        }
    }
}

