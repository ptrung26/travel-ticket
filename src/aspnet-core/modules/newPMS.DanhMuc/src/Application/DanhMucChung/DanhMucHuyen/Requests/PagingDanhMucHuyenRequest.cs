using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Request
{
    public class PagingDanhMucHuyenRequest : PagedFullRequestDto, IRequest<PagedResultDto<HuyenDto>>
    {
    }

    public class PagingDanhMucHuyenHandler : AppBusinessBase, IRequestHandler<PagingDanhMucHuyenRequest, PagedResultDto<HuyenDto>>
    {
        public async Task<PagedResultDto<HuyenDto>> Handle(PagingDanhMucHuyenRequest input, CancellationToken cancellationToken)
        {
            var huyenRepos = Factory.Repository<DanhMucHuyenEntity, string>().AsNoTracking();
            var tinhRepos = Factory.Repository<DanhMucTinhEntity, string>().AsNoTracking();

            var query = (from huyen in huyenRepos
                         join tinh in tinhRepos on huyen.TinhId equals tinh.Id
                         select new HuyenDto
                         {
                             Id = huyen.Id,
                             Ten = huyen.Ten,
                             TenEn = huyen.TenEn,
                             Cap = huyen.Cap,
                             IsActive = huyen.IsActive,
                             TinhId = huyen.TinhId,
                             TenTinh = tinh.Ten
                         })
                        .WhereIf(!string.IsNullOrEmpty(input.Filter), p => p.Ten.ToLower().Contains(input.Filter.Trim().ToLower()) || p.Id.Contains(input.Filter.Trim()))
            .OrderBy(input.Sorting ?? "id asc");

            var dataGrids = await query
            .PageBy(input)
            .ToListAsync(cancellationToken);

            return new PagedResultDto<HuyenDto>(dataGrids.Count(), dataGrids);
        }
    }
}