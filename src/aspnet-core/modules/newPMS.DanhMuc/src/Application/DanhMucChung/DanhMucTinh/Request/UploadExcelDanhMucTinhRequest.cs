using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Request
{
    public class UploadExcelDanhMucTinhRequest : IRequest
    {
        public List<CheckValidImportExcelDanhMucTinhDto> ListData { get; set; }
    }

    public class UploadExcelDanhMucTinhHander : AppBusinessBase, IRequestHandler<UploadExcelDanhMucTinhRequest>
    {
        public UploadExcelDanhMucTinhHander()
        {
        }

        public async Task<Unit> Handle(UploadExcelDanhMucTinhRequest request, CancellationToken cancellationToken)
        {
            foreach (var tinh in request.ListData)
            {
                await CreateOrUpdate(tinh);
            }
            return await Task.FromResult(Unit.Value);
        }

        private async Task CreateOrUpdate(CheckValidImportExcelDanhMucTinhDto input)
        {
            var _repos = Factory.Repository<DanhMucTinhEntity, string>();
            var data = await _repos.FindAsync(x => x.Id == input.Id);
            if (data == null)
            {
                var insertInput = new DanhMucTinhEntity();
                Factory.ObjectMapper.Map(input, insertInput);
                await _repos.InsertAsync(insertInput);
            }
            else
            {
                var updateData = await _repos.GetAsync(input.Id);
                Factory.ObjectMapper.Map(input, updateData);
                await _repos.UpdateAsync(updateData);
            }
        }
    }
}