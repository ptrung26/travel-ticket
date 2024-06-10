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
    public class HuyenComboboxRequest : IRequest<List<ComboBoxDto>>
    {
        public string TinhId { get; set; }

    }
    public class HuyenComboboxHandler : IRequestHandler<HuyenComboboxRequest, List<ComboBoxDto>>
    {
        private readonly IOrdAppFactory _factory;

        public HuyenComboboxHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public Task<List<ComboBoxDto>> Handle(HuyenComboboxRequest request, CancellationToken cancellationToken)
        {
            var query = _factory.Repository<DanhMucHuyenEntity, string>().AsNoTracking()
                .Where(x => x.TinhId == request.TinhId)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Id,
                     DisplayText = $"{x.Ten}",
                 });
            return query.ToListAsync(cancellationToken: cancellationToken);
        }
    }
}
