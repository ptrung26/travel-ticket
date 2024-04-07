using MediatR;
using Microsoft.EntityFrameworkCore;
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

namespace newPMS.DanhMuc.Dtos
{
    public class PagingQuocTichRequest : PagedFullRequestDto, IRequest<PagedResultDto<QuocTichDto>>
    {
    }

    public class PagingQuocTichHandler : AppBusinessBase, IRequestHandler<PagingQuocTichRequest, PagedResultDto<QuocTichDto>>
    {
        public async Task<PagedResultDto<QuocTichDto>> Handle(PagingQuocTichRequest input, CancellationToken cancellationToken)
        {
            var _quocTichrepos = Factory.Repository<DanhMucQuocGiaEntity, string>().AsNoTracking();

            var textSearch = string.IsNullOrEmpty(input.Filter) ? "" : input.Filter.LikeTextSearch().ToLower();
            var query = _quocTichrepos
                 .WhereIf(!string.IsNullOrEmpty(textSearch),
                     x => EF.Functions.Like(x.Ten.ToLower(), textSearch)
                     || EF.Functions.Like(x.TenEn.ToLower(), textSearch)
                     )
                 .OrderBy(input.Sorting ?? "id asc")
                 .Select(
                    qt => Factory.ObjectMapper.Map<DanhMucQuocGiaEntity, QuocTichDto>(qt)
                );

            int totalCount = query.Count();
            var dataGrids = await query
                .PageBy(input)
                .ToListAsync(cancellationToken);

            return new PagedResultDto<QuocTichDto>(totalCount, dataGrids);
        }
    }
}