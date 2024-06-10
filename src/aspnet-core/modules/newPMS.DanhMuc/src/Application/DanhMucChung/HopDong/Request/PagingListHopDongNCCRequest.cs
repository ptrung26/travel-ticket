using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
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
    public class PagingListHopDongNCCRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<HopDongNCCDto>>
    {
        public long NhaCungCapId { get; set; }
    }

    public class PagingListHopDongNCCHandler : IRequestHandler<PagingListHopDongNCCRequest, PagedResultDto<HopDongNCCDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public  PagingListHopDongNCCHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<PagedResultDto<HopDongNCCDto>> Handle(PagingListHopDongNCCRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _hopDongRepos = _factory.Repository<HopDongNCCEntity, long>();
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var result = _hopDongRepos.Where(x => x.NhaCungCapId == request.NhaCungCapId)
                    .WhereIf(!string.IsNullOrEmpty(request.Filter), x => EF.Functions.Like(x.Ma, request.FilterFullText))
                    .Select(x => new HopDongNCCDto
                    {
                        Id = x.Id,
                        Ma = x.Ma,
                        LoaiHopDongCode = x.LoaiHopDongCode,
                        NgayHetHan = x.NgayHetHan,
                        NgayHieuLuc = x.NgayHieuLuc,
                        NgayKy = x.NgayKy,
                        NguoiLapHopDong = x.NguoiLapHopDong,
                        TinhTrang = x.TinhTrang,
                    });
                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);
                for (int i = 0; i < dataGrids.Count; i++)
                {
                    var loaiHopDongCode = csRepos.FirstOrDefault(x => x.Code == dataGrids[i].LoaiHopDongCode);

                    if (loaiHopDongCode != null)
                    {
                        dataGrids[i].LoaiHopDongDisplay = loaiHopDongCode.Display;
                    }
                }

                return new PagedResultDto<HopDongNCCDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                Console.WriteLine("HD_XE: " + ex.Message);
                throw new Exception("Có lỗi xảy ra, vui lòng thử lại sau!");
            }
        }
    }
}
