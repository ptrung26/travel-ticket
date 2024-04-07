using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Requests
{
    public class PagingCodeSystemRequests : PagedFullRequestDto, IRequest<PagedResultDto<CodeSystemDto>>
    {
        public string? ParentCode { get; set; }
    }

    public class PagingCodeSystemHandler : AppBusinessBase, IRequestHandler<PagingCodeSystemRequests, PagedResultDto<CodeSystemDto>>
    {
        public async Task<PagedResultDto<CodeSystemDto>> Handle(PagingCodeSystemRequests request, CancellationToken cancellationToken)
        {
            var csRepos = Factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var query = (from cs in csRepos
                         orderby cs.Id
                         select new CodeSystemDto
                         {
                             Id = cs.Id,
                             Code = cs.Code,
                             Display = cs.Display,
                             NgayTao = cs.CreationTime.ToString("dd/MM/yyyy"),
                             ParentCode = cs.ParentCode,
                             ParentId = cs.ParentId,
                         }).WhereIf(!string.IsNullOrEmpty(request.Filter), p => p.Display.ToLower().Contains(request.Filter.Trim().ToLower()) || p.Code.Trim().Contains(request.Filter.Trim().ToLower()))
                         .WhereIf(!string.IsNullOrEmpty(request.ParentCode), x => x.ParentCode == request.ParentCode)
                         ;
            var dataGrids = await query
         .PageBy(request)
         .ToListAsync(cancellationToken);

            return new PagedResultDto<CodeSystemDto>(query.Count(), dataGrids);
        }
    }
}