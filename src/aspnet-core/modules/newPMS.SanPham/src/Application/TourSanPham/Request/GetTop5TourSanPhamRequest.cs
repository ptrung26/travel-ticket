using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.TourSanPham.Dtos;
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
    public class GetTop5TourSanPhamRequest : IRequest<List<TourSanPhamDto>>
    {
    }

    public class GetTop5TourSanPhamHandler: IRequestHandler<GetTop5TourSanPhamRequest, List<TourSanPhamDto>>
    {
        private readonly IOrdAppFactory _factory;

        public GetTop5TourSanPhamHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<List<TourSanPhamDto>> Handle(GetTop5TourSanPhamRequest request, CancellationToken cancellationToken)
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
                                  UrlAnhBia = t.UrlAnhBia,
                                  DiemDen = t.DiemDen,
                                  ThanhTienKhoangNguoiJson = t.ThanhTienKhoangNguoiJson, 
                                  TinhId = t.TinhId, 
                                  QuocGiaId = t.QuocGiaId,
                              }).Take(5).ToList(); 

                for (int i = 0; i < result.Count; i++)
                {
                    var loaiHinhDuLich = csRepos.FirstOrDefault(x => x.Code == result[i].LoaiHinhDuLichCode);
                    var loaiTour = csRepos.FirstOrDefault(x => x.Code == result[i].LoaiTourCode);
                    var item = result[i]; 
                    if (loaiHinhDuLich != null)
                    {
                        item.LoaiHinhDuLichDisplay = loaiHinhDuLich.Display;
                    }
                    if (loaiHinhDuLich != null)
                    {
                       item.LoaiTourDisplay = loaiTour.Display;
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

                return  result; 
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }
        }
    }
}
