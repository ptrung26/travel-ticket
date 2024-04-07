using MediatR;
using newPMS.Entities;
using OrdBaseApplication;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.DanhMuc.Dtos
{
    public class UploadExcelQuocGiaRequest : IRequest
    {
        public List<CheckValidImportExcelQuocTichDto> ListData { get; set; }
    }

    public class UploadExcelQuocGIaHander : AppBusinessBase, IRequestHandler<UploadExcelQuocGiaRequest>
    {
        private readonly IRepository<DanhMucQuocGiaEntity, string> _repos;

        public UploadExcelQuocGIaHander(IRepository<DanhMucQuocGiaEntity, string> repos)
        {
            _repos = repos;
        }

        public async Task<Unit> Handle(UploadExcelQuocGiaRequest request, CancellationToken cancellationToken)
        {
            foreach (var qg in request.ListData)
            {
                await CreateOrUpdate(qg);
            }
            return await Task.FromResult(Unit.Value);
        }

        private async Task CreateOrUpdate(CheckValidImportExcelQuocTichDto input)
        {
            var insertInput = new DanhMucQuocGiaEntity();
            Factory.ObjectMapper.Map(input, insertInput);
            //insertInput.IsActive = true;

            if (_repos.Any(qg => qg.Id == input.Id))
            {
                await _repos.UpdateAsync(insertInput);
            }
            else
            {
                await _repos.InsertAsync(insertInput);
            }
        }
    }
}