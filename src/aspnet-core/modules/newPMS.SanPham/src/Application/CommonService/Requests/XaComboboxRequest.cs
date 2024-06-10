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
    public class XaComboboxRequest : IRequest<List<ComboBoxDto>>
    {
        public string HuyenId { get; set; }
    }
    public class XaComboboxHandler : IRequestHandler<XaComboboxRequest, List<ComboBoxDto>>
    {
        private readonly IOrdAppFactory _factory;

        public XaComboboxHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public Task<List<ComboBoxDto>> Handle(XaComboboxRequest request, CancellationToken cancellationToken)
        {
            var query = _factory.Repository<DanhMucXaEntity, string>().AsNoTracking()
                .Where(x => x.HuyenId == request.HuyenId)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Id,
                     DisplayText = $"{x.Ten}",
                 });
            return query.ToListAsync(cancellationToken: cancellationToken);
        }
    }
}
