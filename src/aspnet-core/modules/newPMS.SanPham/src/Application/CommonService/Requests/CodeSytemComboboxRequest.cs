
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.CommonService.Query
{
    public class CodeSystemComboboxRequest : IRequest<List<ComboBoxDto>>
    {
    }
    public class CodeSystemComboboxHandler : IRequestHandler<CodeSystemComboboxRequest, List<ComboBoxDto>>
    {
        private readonly IOrdAppFactory _factory;

        public CodeSystemComboboxHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public Task<List<ComboBoxDto>> Handle(CodeSystemComboboxRequest request, CancellationToken cancellationToken)
        {
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == null)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 });
            return query.ToListAsync(cancellationToken: cancellationToken);
        }
    }
}
