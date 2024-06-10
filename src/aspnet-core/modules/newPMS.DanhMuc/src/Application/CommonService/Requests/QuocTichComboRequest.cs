using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.CommonService.Query
{
    public class QuocTichComboboxRequest : IRequest<List<ComboBoxDto>>
    {

    }
    public class QuocTichComboboxHandler : IRequestHandler<QuocTichComboboxRequest, List<ComboBoxDto>>
    {
        private readonly IOrdAppFactory _factory;

        public QuocTichComboboxHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public Task<List<ComboBoxDto>> Handle(QuocTichComboboxRequest request, CancellationToken cancellationToken)
        {
            var query = _factory.Repository<DanhMucQuocGiaEntity, string>().AsNoTracking()
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Id,
                     DisplayText = $"{x.Ten}",
                 });
            return query.ToListAsync(cancellationToken: cancellationToken);
        }

      

    }
}
