using Dapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.QuanLyTaiKhoan.Dtos;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.QuanLyTaiKhoan.Request
{
    public class PagingTextTemplateRequest : PagedFullRequestDto, IRequest<PagedResultDto<TextTemplateDto>>
    {
    }

    public class PagingTextTemplateHandler : AppBusinessBase, IRequestHandler<PagingTextTemplateRequest, PagedResultDto<TextTemplateDto>>
    {
        public async Task<PagedResultDto<TextTemplateDto>> Handle(PagingTextTemplateRequest input, CancellationToken cancellationToken)
        {
            var defautDb = Factory.DefaultDbFactory.Connection;
            SettingManagementDto setting = new SettingManagementDto();

            var sql = $@"SELECT Id, Name, Content FROM abptexttemplatecontents WHERE IsDeleted = 0";

            var query = await defautDb.QueryAsync<TextTemplateDto>(sql);
            var totalCount = query.Count();

            return new PagedResultDto<TextTemplateDto>(totalCount, query.ToList());
        }
    }
}