using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Requests
{
    public class GetAllByParentCodeRequest : IRequest<List<CodeSystemDto>>
    {
        public string ParentCode { get; set; }
    }

    public class GetListByParentIdHandler : AppBusinessBase, IRequestHandler<GetAllByParentCodeRequest, List<CodeSystemDto>>
    {
        private readonly IOrdAppFactory _factory;

        public GetListByParentIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<List<CodeSystemDto>> Handle(GetAllByParentCodeRequest request, CancellationToken cancellationToken)
        {
            var _codeSystemRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();

            var query = (from tb in _codeSystemRepos
                         select new CodeSystemDto
                         {
                             Id = tb.Id,
                             ParentId = tb.ParentId,
                             ParentCode = tb.ParentCode,
                             Display = tb.Display,
                             Code = tb.Code
                         })
                         .WhereIf(!string.IsNullOrEmpty(request.ParentCode), x => x.ParentCode == request.ParentCode);

            var dataGrids = await query.ToListAsync(cancellationToken);

            return dataGrids;
        }
    }
}
