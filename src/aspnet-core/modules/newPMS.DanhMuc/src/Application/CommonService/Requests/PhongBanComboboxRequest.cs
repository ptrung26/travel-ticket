using MediatR;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using System.Linq;

namespace newPMS.CommonService.Query

{
    public class PhongBanComboboxRequest : IRequest<List<ComboBoxDto>>
    {

    }

    public class PhongBanComboBoxHandler : IRequestHandler<PhongBanComboboxRequest, List<ComboBoxDto>>
    {
        private readonly IOrdAppFactory _factory;
        public PhongBanComboBoxHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public Task<List<ComboBoxDto>> Handle (PhongBanComboboxRequest request, CancellationToken cancellationToken)
        {
            var Query = _factory.Repository<SysOrganizationunits, long>().AsNoTracking()
                .Select(x => new ComboBoxDto()
                {
                    Value = x.Id,
                    DisplayText = $"{x.TenPhongBan}"
                });
            return Query.ToListAsync(cancellationToken: cancellationToken);
        }
    }
}