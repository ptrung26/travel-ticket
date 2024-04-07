using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.DanhMuc.Request
{
    public class UploadExcelXaRequest : IRequest
    {
        public List<CheckValidImportExcelXaDto> ListData { get; set; }
    }

    public class UploadExcelXaHander : AppBusinessBase, IRequestHandler<UploadExcelXaRequest>
    {
        private readonly IRepository<DanhMucXaEntity, string> _xaRepos;

        public UploadExcelXaHander(IRepository<DanhMucXaEntity, string> xaRepos)
        {
            _xaRepos = xaRepos;
        }

        public async Task<Unit> Handle(UploadExcelXaRequest request, CancellationToken cancellationToken)
        {
            foreach (var xa in request.ListData)
            {
                await CreateOrUpdate(xa);
            }
            return await Task.FromResult(Unit.Value);
        }

        private async Task CreateOrUpdate(CheckValidImportExcelXaDto input)
        {
            var xa = _xaRepos.FirstOrDefault(xa => xa.Id == input.Id);
            if (xa != null)
            {
                Factory.ObjectMapper.Map(input, xa);
                await _xaRepos.UpdateAsync(xa);
            }
            else
            {
                var insertInput = new DanhMucXaEntity();
                Factory.ObjectMapper.Map(input, insertInput);
                //insertInput.IsActive = true;
                await _xaRepos.InsertAsync(insertInput);
            }
        }
    }
}