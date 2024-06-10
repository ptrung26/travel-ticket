using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.KhachHang;
using newPMS.KhachHang.Dtos;
using newPMS.TourSanPham.Dtos;
using newPMS.TourSanPham.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.KhachHang.Request
{
    public class PagingListKhachHangRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<KhachHangDto>>
    {
    }

    public class PagingListKhachHangHandler : IRequestHandler<PagingListKhachHangRequest, PagedResultDto<KhachHangDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListKhachHangHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<PagedResultDto<KhachHangDto>> Handle(PagingListKhachHangRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _tourSpRepos = _factory.Repository<KhachHangEntity, long>();
                var result = (from t in _tourSpRepos
                              select new KhachHangDto
                              {
                                  Id = t.Id,
                                  Ma = t.Ma,
                                  Ten = t.Ten,
                                  DiaChi = t.DiaChi, 
                                  SoDienThoai = t.SoDienThoai, 
                                  Email = t.Email, 
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter),
                              x =>
                              EF.Functions.Like(x.Ten, request.FilterFullText) || EF.Functions.Like(x.Ma, request.FilterFullText));

                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);
                return new PagedResultDto<KhachHangDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }
        }
    }
}
