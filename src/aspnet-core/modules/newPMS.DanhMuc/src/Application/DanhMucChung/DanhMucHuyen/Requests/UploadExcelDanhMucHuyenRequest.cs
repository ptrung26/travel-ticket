using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Request



{
    public class UploadExcelDanhMucHuyenRequest : IRequest
    {
        public List<CheckValidImportExcelDanhMucHuyenDto> ListData { get; set; }
    }

    public class UploadExcelDanhMucHuyenHander : AppBusinessBase, IRequestHandler<UploadExcelDanhMucHuyenRequest>
    {
        public UploadExcelDanhMucHuyenHander()
        {
        }

        public async Task<Unit> Handle(UploadExcelDanhMucHuyenRequest request, CancellationToken cancellationToken)
        {
            foreach (var huyen in request.ListData)
            {
                await CreateOrUpdate(huyen);
            }
            return await Task.FromResult(Unit.Value);
        }

        private async Task CreateOrUpdate(CheckValidImportExcelDanhMucHuyenDto input)
        {
           try
            {
                var _repos = Factory.Repository<DanhMucHuyenEntity, string>();
                var _tinhRepos = Factory.Repository<DanhMucTinhEntity, string>();

                var dataTinh = await _tinhRepos.FirstOrDefaultAsync(x => x.Ten.ToLower() == input.TenTinh.ToLower());
                var data = await _repos.FirstOrDefaultAsync(x => x.Id == input.Id);

                if(dataTinh != null)
                {
                    if (data == null)
                    {
                        var insertInput = new DanhMucHuyenEntity();
                        Factory.ObjectMapper.Map(input, insertInput);
                        insertInput.TinhId = dataTinh.Id;
                        await _repos.InsertAsync(insertInput);
                    }
                    else
                    {
                        var updateData = await _repos.GetAsync(input.Id);
                        Factory.ObjectMapper.Map(input, updateData);
                        updateData.TinhId = dataTinh.Id;
                        await _repos.UpdateAsync(updateData);
                    }
                }
            } catch(Exception ex)
            {
                Console.WriteLine(ex.Message); 
            }
           
        }
    }
}