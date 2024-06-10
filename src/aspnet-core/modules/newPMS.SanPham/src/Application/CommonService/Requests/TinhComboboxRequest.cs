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
    public class TinhComboboxRequest : IRequest<List<ComboBoxDto>>
    {

    }
    public class TinhComboboxHandler : IRequestHandler<TinhComboboxRequest, List<ComboBoxDto>>
    {
        private readonly IOrdAppFactory _factory;

        public TinhComboboxHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public Task<List<ComboBoxDto>> Handle(TinhComboboxRequest request, CancellationToken cancellationToken)
        {
            var query = _factory.Repository<DanhMucTinhEntity, string>().AsNoTracking()
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Id,
                     DisplayText = $"{x.Ten}",
                     Data = x,
                 });
            return query.ToListAsync(cancellationToken: cancellationToken);
        }
    }
}
