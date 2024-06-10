using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.TourSanPham.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.TourSanPham.Request
{
    public class PagingListChuongTrinhTourRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<ChuongTrinhTourDto>>
    {
        public long TourSanPhamId { get; set; }
    }

    public class PagingListChuongTrinhTourHandler : IRequestHandler<PagingListChuongTrinhTourRequest, PagedResultDto<ChuongTrinhTourDto>>
    {
        private readonly IOrdAppFactory _factory;
        public PagingListChuongTrinhTourHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<PagedResultDto<ChuongTrinhTourDto>> Handle(PagingListChuongTrinhTourRequest request, CancellationToken cancellationToken)
        {
            var catchError = "";
            try
            {
                var _chuongTrinhRepos = _factory.Repository<ChuongTrinhTourEntity, long>().AsNoTracking().ToList();
                var _tourRepos = _factory.Repository<TourSanPhamEntity, long>().AsNoTracking().ToList();
                var tourSP = _tourRepos.FirstOrDefault(x => x.Id == request.TourSanPhamId);
                if (tourSP == null)
                {
                    catchError = "Tour không tồn tại, hoặc đã bị xoá";
                    throw new Exception(catchError);
                }
                var res = (from t in _tourRepos
                           join ct in _chuongTrinhRepos
                           on t.Id equals ct.TourSanPhamId
                           where ct.TourSanPhamId == tourSP.Id
                           select new ChuongTrinhTourDto
                           {
                               Id = ct.Id,
                               TourSanPhamId = t.Id,
                               DiemDen = t.DiemDen,
                               ListDichVuJson = ct.ListDichVuJson,
                               NoiDung = ct.NoiDung,
                               TenHanhTrinh = ct.TenHanhTrinh,
                               TepDinhKemJson = ct.TepDinhKemJson,
                               NgayThu = ct.NgayThu,
                           }).ToList();

                var totalCount = res.AsQueryable().Count();
                var dataGrids = res.AsQueryable().PageBy(request).ToList();

                return new PagedResultDto<ChuongTrinhTourDto>(totalCount, dataGrids);

            }
            catch (Exception ex)
            {
                Console.WriteLine("Paging_SanPham_ChuongTrinhTour:" + ex.Message);
                throw string.IsNullOrEmpty(catchError) ? new Exception("Có lỗi xảy ra vui lòng thử lại sau") : new Exception(catchError);
            }
        }
    }

}
