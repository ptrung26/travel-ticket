using Humanizer;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
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

namespace newPMS.TourSanPham.Request
{
    public class PagingListTourSanPhamRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<TourSanPhamDto>>
    {
        public string QuocGiaId { get; set; }
        public string TinhId { get; set; }
    }

    public class PagingListTourSanPhamHandler : IRequestHandler<PagingListTourSanPhamRequest, PagedResultDto<TourSanPhamDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListTourSanPhamHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<PagedResultDto<TourSanPhamDto>> Handle(PagingListTourSanPhamRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _tourSpRepos = _factory.Repository<TourSanPhamEntity, long>();
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
                                  SoLuongMoBan = t.SoLuongMoBan, 
                                  NgayMoBan = t.ThoiGianMoBan, 
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter),
                              x =>
                              EF.Functions.Like(x.Ten, request.FilterFullText) || EF.Functions.Like(x.Ma, request.FilterFullText))
                              .WhereIf(!string.IsNullOrEmpty(request.QuocGiaId),
                              x => !string.IsNullOrEmpty(x.QuocGiaId) && x.QuocGiaId == request.QuocGiaId)
                              .WhereIf(!string.IsNullOrEmpty(request.TinhId),
                              x => !string.IsNullOrEmpty(x.QuocGiaId) && x.QuocGiaId == request.TinhId); 

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
                Console.WriteLine("PAGING_SANPHAM_TourSP:" + ex.Message);
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }
        }
    }
}
