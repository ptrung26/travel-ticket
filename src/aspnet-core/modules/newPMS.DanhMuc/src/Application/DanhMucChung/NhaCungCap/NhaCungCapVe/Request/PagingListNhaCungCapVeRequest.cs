using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Request;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities.DanhMuc.NhaCungCap;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMucChung.NhaCungCap.NhaCungCapVe.Request
{
    public class PagingListNhaCungCapVeRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<NhaCungCapVeDto>>
    {
        public long? SoSaoDanhGia { get; set; }
    }

    public class PagingListNhaCungCapVeHandler : IRequestHandler<PagingListNhaCungCapVeRequest, PagedResultDto<NhaCungCapVeDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListNhaCungCapVeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<PagedResultDto<NhaCungCapVeDto>> Handle(PagingListNhaCungCapVeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var result = (from ve in _factory.Repository<NhaCungCapVeEntity, long>()
                              select new NhaCungCapVeDto
                              {
                                  Id = ve.Id,
                                  Ma = ve.Ma,
                                  Ten = ve.Ten,
                                  Email = ve.Email,
                                  Fax = ve.Fax,
                                  SoSaoDanhGia = ve.SoSaoDanhGia,
                                  AnhDaiDienUrl = ve.AnhDaiDienUrl,
                                  DiaChi = ve.DiaChi,
                                  DichVu = ve.DichVu,
                                  IsHasVAT = ve.IsHasVAT,
                                  MoTa = ve.MoTa,
                                  NgayHetHanHopDong = ve.NgayHetHanHopDong,
                                  QuocGiaId = ve.QuocGiaId,
                                  TinhId = ve.TinhId,
                                  TaiLieuJson = ve.TaiLieuJson,
                                  TinhTrang = ve.TinhTrang,
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter), x => EF.Functions.Like(x.Ten, request.FilterFullText))
                          .WhereIf(request.SoSaoDanhGia.HasValue, x => x.SoSaoDanhGia == request.SoSaoDanhGia.Value);


                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);

                return new PagedResultDto<NhaCungCapVeDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                Console.WriteLine("PAGING_DM_VE:" + ex.Message);
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }

        }
    }
}
