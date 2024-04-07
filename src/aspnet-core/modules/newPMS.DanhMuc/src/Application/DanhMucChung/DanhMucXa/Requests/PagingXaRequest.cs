using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Helper;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Request
{
    public class PagingXaRequest : PagedFullRequestDto, IRequest<PagedResultDto<XaDto>>
    {
        public string HuyenId { get; set; }
        public string TinhId { get; set; }
    }

    public class PagingXaHandler : AppBusinessBase, IRequestHandler<PagingXaRequest, PagedResultDto<XaDto>>
    {
        public async Task<PagedResultDto<XaDto>> Handle(PagingXaRequest input, CancellationToken cancellationToken)
        {
            var textSearch = input.Filter.LikeTextSearch();
            var xaRepos = Factory.Repository<DanhMucXaEntity, string>().AsNoTracking();
            var tinhRepos = Factory.Repository<DanhMucTinhEntity, string>().AsNoTracking();
            var huyenRepos = Factory.Repository<DanhMucHuyenEntity, string>().AsNoTracking();
            var query = (from xa in xaRepos
                         join huyen in huyenRepos on xa.HuyenId equals huyen.Id
                         join tinh in tinhRepos on huyen.TinhId equals tinh.Id
                         select new XaDto
                         {
                             Id = xa.Id,
                             Ten = xa.Ten,
                             TenEn = xa.TenEn,
                             Cap = xa.Cap,
                             IsActive = xa.IsActive,
                             HuyenId = xa.HuyenId,
                             TinhId = huyen.TinhId,
                             TenHuyen = huyen.Ten,
                             TenTinh = tinh.Ten
                         })
                .WhereIf(!string.IsNullOrEmpty(textSearch),
                                    x => EF.Functions.Like(x.Ten, textSearch) || x.Id == input.Filter)
            .WhereIf(!string.IsNullOrEmpty(input.TinhId), x => x.TinhId == input.TinhId)
            .WhereIf(!string.IsNullOrEmpty(input.HuyenId), x => x.HuyenId == input.HuyenId)
            .OrderBy(input.Sorting ?? "id asc");
            var dataGrids = await query
                .PageBy(input)
                .ToListAsync(cancellationToken);

            return new PagedResultDto<XaDto>(query.Count(), dataGrids);
        }
    }
}