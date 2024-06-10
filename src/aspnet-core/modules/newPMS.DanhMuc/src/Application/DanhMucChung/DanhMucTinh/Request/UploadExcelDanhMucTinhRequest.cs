using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using System;
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
            try
            {
                var _repos = Factory.Repository<DanhMucTinhEntity, string>();
                var data = await _repos.FindAsync(x => x.Ma == input.Ma);
                if (data == null)
                {
                    var insertInput = new DanhMucTinhEntity();
                    Factory.ObjectMapper.Map(input, insertInput);
                    await _repos.InsertAsync(insertInput);
                }
                else
                {
                    var updateData = await _repos.FirstOrDefaultAsync(x => x.Ma == input.Ma);
                    Factory.ObjectMapper.Map(input, updateData);
                    await _repos.UpdateAsync(updateData);
                }
            } catch(Exception ex)
            {
                 
            }
           
        }
    }
}