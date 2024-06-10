using System;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.CommonService.Business
{
    public class GetCodeSytemComboDataRequest : IRequest<List<ComboBoxDto>>
    {
        public string ParentCode { get; set; }
        public string Takes { get; set; }
        public long? ParentId { get; set; }
    }
    public class GetCodeSytemComboDataRequestHandler : IRequestHandler<GetCodeSytemComboDataRequest, List<ComboBoxDto>>
    {
        private readonly IOrdAppFactory _factory;

        public GetCodeSytemComboDataRequestHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<List<ComboBoxDto>> Handle(GetCodeSytemComboDataRequest request, CancellationToken cancellationToken)
        {

            var queryDic = _factory.Repository<CodeSystemEntity, long>().AsNoTracking().OrderBy(m => m.Id)
                .Where(x => x.ParentCode == request.ParentCode)
                .WhereIf(request.ParentId.HasValue, x => x.ParentId == request.ParentId)
                .Select(x => new ComboBoxDto
                {
                    Value = x.Code.ToString(),
                    DisplayText = x.Display,
                });


            var result = await queryDic.ToListAsync(cancellationToken: cancellationToken);

            if (string.IsNullOrEmpty(request.Takes))
                return result;

            if (!result.Any())
                return result;

            try
            {
                var codes = request.Takes.Split(",");

                return (from item in result from code in codes let dataItem = item.Data where ((dynamic)dataItem).Code == code select item).ToList();
            }
            catch
            {
                return result;
            }

        }
    }
}
