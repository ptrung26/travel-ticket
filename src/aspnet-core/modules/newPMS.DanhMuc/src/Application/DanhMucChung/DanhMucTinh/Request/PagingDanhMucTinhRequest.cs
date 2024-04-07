using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Request
{
    public class PagingDanhMucTinhRequest : PagedFullRequestDto, IRequest<PagedResultDto<TinhDto>>
    {
        public int? PhanVung { get; set; }
    }

    public class PagingDanhMucTinhHandler : AppBusinessBase, IRequestHandler<PagingDanhMucTinhRequest, PagedResultDto<TinhDto>>
    {
        public async Task<PagedResultDto<TinhDto>> Handle(PagingDanhMucTinhRequest input, CancellationToken cancellationToken)
        {
            var tinhRepos = Factory.Repository<DanhMucTinhEntity, string>().AsNoTracking();

            var query = (from tinh in tinhRepos
                         select new TinhDto
                         {
                             Id = tinh.Id,
                             Ten = tinh.Ten,
                             Ma = tinh.Ma,
                             TenEn = tinh.TenEn,
                             Cap = tinh.Cap,
                             IsTinhGan = tinh.IsTinhGan,
                             IsActive = tinh.IsActive,
                             PhanVung = tinh.PhanVung,
                         })
                        .WhereIf(!string.IsNullOrEmpty(input.Filter), p => p.Ten.ToLower().Contains(input.Filter.Trim().ToLower()) || p.Id.Contains(input.Filter.Trim()))
            .OrderBy(input.Sorting ?? "id asc");

            var dataGrids = await query
            .PageBy(input)
            .ToListAsync(cancellationToken);

            return new PagedResultDto<TinhDto>(dataGrids.Count(), dataGrids);
        }
    }
}