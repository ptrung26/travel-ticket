using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.Request;
using newPMS.Entities;
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
    public class PagingListDichVuVeRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<DichVuVeDto>>
    {
        public long NhaCungCapVeId { get; set; }
    }

    public class PagingListDichVuVeHandler : IRequestHandler<PagingListDichVuVeRequest, PagedResultDto<DichVuVeDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListDichVuVeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<PagedResultDto<DichVuVeDto>> Handle(PagingListDichVuVeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var result = (from dvx in _factory.Repository<DichVuVeEntity, long>()
                              select new DichVuVeDto
                              {
                                  Id = dvx.Id,
                                  Ma = dvx.Ma,
                                  Ten = dvx.Ten,
                                  GhiChu = dvx.GhiChu,
                                  GiaBan = dvx.GiaBan,
                                  GiaNett = dvx.GiaNett,
                                  IsHasThueVAT = dvx.IsHasThueVAT,
                                  JsonTaiLieu = dvx.JsonTaiLieu,
                                  LoaiTienTeCode = dvx.LoaiTienTeCode,
                                  NhaCungCapVeId = dvx.NhaCungCapVeId,
                                  TuNgay = dvx.TuNgay,
                                  DenNgay = dvx.DenNgay,
                                  TinhTrang = dvx.TinhTrang,
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter), x => EF.Functions.Like(x.Ma, request.FilterFullText)
                              || EF.Functions.Like(x.Ten, request.FilterFullText))
                          .Where(x => x.NhaCungCapVeId == request.NhaCungCapVeId);

                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);
                for (int i = 0; i < dataGrids.Count; i++)
                {
                    var loaiTienTeCode = csRepos.FirstOrDefault(x => x.Code == dataGrids[i].LoaiTienTeCode);
                    if (loaiTienTeCode != null)
                    {
                        dataGrids[i].LoaiTienTeDisplay = loaiTienTeCode.Display;
                    }
                }

                return new PagedResultDto<DichVuVeDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                Console.WriteLine("PAGING_DV_VE:" + ex.Message);
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }

        }
    }
}
