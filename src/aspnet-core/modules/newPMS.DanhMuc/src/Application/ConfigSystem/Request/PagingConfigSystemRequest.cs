using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.DanhMuc.Dtos;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using OrdBaseApplication.Helper;

namespace newPMS.DanhMuc.Request
{
    public class PagingConfigSystemRequest : PagedFullRequestDto, IRequest<PagedResultDto<ConfigSystemDto>>
    {
    }

    public class PagingConfigSystemHandler : AppBusinessBase, IRequestHandler<PagingConfigSystemRequest, PagedResultDto<ConfigSystemDto>>
    {
        public async Task<PagedResultDto<ConfigSystemDto>> Handle(PagingConfigSystemRequest input, CancellationToken cancellationToken)
        {
            var textSearch = input.Filter.LikeTextSearch();
            var ConfigSystemRepos = Factory.Repository<ConfigSystemEntity, long>();
            var query = (from tb in ConfigSystemRepos
                         select new ConfigSystemDto
                         {
                             Id = tb.Id,
                             Type = tb.Type,
                             Ma = tb.Ma,
                             GiaTri = tb.GiaTri,
                             MoTa = tb.MoTa,
                             TuNgay = tb.TuNgay,
                             DenNgay = tb.DenNgay
                         }
                        ).WhereIf(!string.IsNullOrEmpty(textSearch), x => EF.Functions.Like(x.Ma, textSearch) || EF.Functions.Like(x.GiaTri, textSearch))
                .OrderBy(input.Sorting ?? "Id asc");

            var totalCount = query.Count();
            var items = await query
                .PageBy(input)
                .ToListAsync(cancellationToken);

            return new PagedResultDto<ConfigSystemDto>(totalCount, items);
        }
    }
}