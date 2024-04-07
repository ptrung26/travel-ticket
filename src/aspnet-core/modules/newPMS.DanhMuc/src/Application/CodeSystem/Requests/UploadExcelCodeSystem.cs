using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.DanhMuc.Requests
{
    public class UploadExcelCodeSystemRequest : IRequest
    {
        public List<CheckValidImportExcelCodeSystemDto> ListData { get; set; }
        public string? ParentCode { get; set; }
    }

    public class UploadExcelCodeSystemHander : AppBusinessBase, IRequestHandler<UploadExcelCodeSystemRequest>
    {
        private readonly IRepository<CodeSystemEntity, long> _codeSystemChungRepos;

        public UploadExcelCodeSystemHander(IRepository<CodeSystemEntity, long> codeSystemChungRepos)
        {
            _codeSystemChungRepos = codeSystemChungRepos;
        }

        public async Task<Unit> Handle(UploadExcelCodeSystemRequest request, CancellationToken cancellationToken)
        {
            var _repos = Factory.Repository<CodeSystemEntity, long>();
            var codeSystemRepos = _repos.FirstOrDefault(x => x.Code == request.ParentCode);

            foreach (var cs in request.ListData)
            {

                    var insertInput = new CodeSystemEntity();
                    cs.ParentId = codeSystemRepos != null ? codeSystemRepos.Id : null;
                    cs.ParentCode = codeSystemRepos != null ? codeSystemRepos.Code : null;
                    Factory.ObjectMapper.Map(cs, insertInput);
                    await _repos.InsertAsync(insertInput);

            }

            return await Task.FromResult(Unit.Value);
        }
    }
}