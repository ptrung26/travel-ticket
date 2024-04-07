using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.DanhMuc.Requests
{
    public class CheckValidImportExcelCodeSystemRequest : IRequest<List<CheckValidImportExcelCodeSystemDto>>
    {
        public List<CheckValidImportExcelCodeSystemDto> Input { get; set; }
        public string ParentCode { get; set; }
    }

    public class CheckValidImportExcelCodeSystemHandler : IRequestHandler<CheckValidImportExcelCodeSystemRequest, List<CheckValidImportExcelCodeSystemDto>>
    {
        private readonly IRepository<CodeSystemEntity, long> _CodeSystemRepos;

        public CheckValidImportExcelCodeSystemHandler(
            IRepository<CodeSystemEntity, long> CodeSystemRepos
            )
        {
            _CodeSystemRepos = CodeSystemRepos;
        }

        public async Task<List<CheckValidImportExcelCodeSystemDto>> Handle(CheckValidImportExcelCodeSystemRequest request, CancellationToken cancellationToken)
        {
            var res = new List<CheckValidImportExcelCodeSystemDto>();
            foreach (var item in request.Input)
            {
                item.ListError = new List<string>();
                var ma = _CodeSystemRepos.FirstOrDefault(t => t.Code == item.Code && t.ParentCode == request.ParentCode);

                if (ma != null)
                {
                    item.ListError.Add("Dữ liệu đã tồn tại!");
                }

                res.Add(new CheckValidImportExcelCodeSystemDto
                {
                    Code = item.Code,
                    Display = item.Display,
                    IsValid = item.ListError.Count == 0,
                    ListError = item.ListError,
                    NgayTao = item.NgayTao
                });
            }
            return res;
        }
    }
}