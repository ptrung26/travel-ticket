using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.Request;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.NhaCungCap.NguoiLienHe.Request
{
    public class PagingListNguoiLienHeRequest : PagedFullRequestDto, IRequest<PagedResultDto<NguoiLienHeNCCDto>>
    {
        public long NhaCungCapId { get; set; }
    }

    public class PagingListNguoiLienHeHandler : IRequestHandler<PagingListNguoiLienHeRequest, PagedResultDto<NguoiLienHeNCCDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListNguoiLienHeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<PagedResultDto<NguoiLienHeNCCDto>> Handle(PagingListNguoiLienHeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var result = (from lh in _factory.Repository<NguoiLienHeNCCEntity, long>()
                              select new NguoiLienHeNCCDto
                              {
                                  Id = lh.Id,
                                  ChucVu = lh.ChucVu,
                                  DienThoai = lh.DienThoai,
                                  Email = lh.Email,
                                  HoVaTen = lh.HoVaTen,
                                  NhaCungCapCode = lh.NhaCungCapCode,
                                  NhaCungCapId = lh.NhaCungCapId,
                                  PhongBan = lh.PhongBan,
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter), x => EF.Functions.Like(x.HoVaTen, request.FilterFullText))
                          .Where(x => x.NhaCungCapId == request.NhaCungCapId);

                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);
                return new PagedResultDto<NguoiLienHeNCCDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                Console.WriteLine("PAGING_DV_XE:" + ex.Message);
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }

        }
    }

}

