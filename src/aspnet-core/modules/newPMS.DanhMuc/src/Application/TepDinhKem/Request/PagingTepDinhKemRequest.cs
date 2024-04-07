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

namespace newPMS.DanhMuc.Request
{
    public class PagingTepDinhKemRequest : PagedFullRequestDto, IRequest<PagedResultDto<TepDinhKemDto>>
    {
        public long IdDanhMuc { get; set; }
        public int LoaiDanhMuc { get; set; }
    }

    public class PagingTepDinhKemHandler : AppBusinessBase, IRequestHandler<PagingTepDinhKemRequest, PagedResultDto<TepDinhKemDto>>
    {
        public async Task<PagedResultDto<TepDinhKemDto>> Handle(PagingTepDinhKemRequest input, CancellationToken cancellationToken)
        {
            var tepDinhKemRepos = Factory.Repository<TepDinhKemEntity, long>();
            var query = (from tep in tepDinhKemRepos.Where(x => x.IdDanhMuc == input.IdDanhMuc && x.LoaiDanhMuc == input.LoaiDanhMuc)
                         select new TepDinhKemDto
                         {
                             Id = tep.Id,
                             TenGoc = tep.TenGoc,
                             TenLuuTru = tep.TenLuuTru,
                             DuongDan = tep.DuongDan,
                             DuongDanTuyetDoi = tep.DuongDan
                         }
                        )
                .OrderBy(input.Sorting ?? "Id asc");

            var totalCount = query.Count();
            var items = await query
                .PageBy(input)
                .ToListAsync(cancellationToken);

            return new PagedResultDto<TepDinhKemDto>(totalCount, items);
        }
    }
}