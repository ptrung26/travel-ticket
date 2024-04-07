using Dapper;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Requests;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Services
{
    public class CodeSystemService : DanhMucCrudAppService<
                                            CodeSystemEntity,
                                            CodeSystemDto,
                                            long,
                                            PagingCodeSystemRequests,
                                            CodeSystemDto>
    {
        public CodeSystemService(IOrdAppFactory appFactory) : base(appFactory)
        {
        }

        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public override async Task<PagedResultDto<CodeSystemDto>> GetListAsync(PagingCodeSystemRequests req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        public async Task<List<long>> MultiDeleteItem(List<CodeSystemDto> listDM)
        {
            var _codeSystemRepos = AppFactory.Repository<CodeSystemEntity, long>();

            //Xóa danh mục con
            foreach (var i in listDM)
            {
                var codeSystem1 = await _codeSystemRepos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == i.Id);
                if (codeSystem1 != null)
                {
                    await _codeSystemRepos.DeleteAsync(codeSystem1.Id);
                }
            }

            //Nếu trong list Xóa có danh mục cha thì xóa luôn danh mục + danh mục con
            foreach (var i in listDM)
            {
                if (i.ParentId == null)
                {
                    var listItem = await _codeSystemRepos.Where(x => x.ParentId == i.Id || x.Id == i.Id).ToListAsync();
                    foreach (var item in listItem)
                    {
                        var codeSystem = await _codeSystemRepos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == item.Id);
                        if (codeSystem != null)
                        {
                            await _codeSystemRepos.DeleteAsync(codeSystem.Id);
                        }
                    }
                }
            }
            return null;
        }

        public async Task<long> ItemDelete(long id)
        {
            var _codeSystemRepos = AppFactory.Repository<CodeSystemEntity, long>();
            var _codeSystem = _codeSystemRepos.FirstOrDefault(v => v.Id == id);
            var parentId = _codeSystem.ParentId;

            if (parentId == null)
            {
                var listItem = await _codeSystemRepos.Where(x => x.ParentId == _codeSystem.Id).ToListAsync();
                listItem.Add(_codeSystem);
                foreach (var item in listItem)
                {
                    var codeSystem = await _codeSystemRepos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == item.Id);
                    if (codeSystem != null)
                    {
                        await _codeSystemRepos.DeleteAsync(codeSystem.Id);
                    }
                }
            }
            else
            {
                await _codeSystemRepos.DeleteAsync(id);
            }
            return 0;
        }

        public async Task<CommonResultDto<bool>> CodeSystemCreateOrUpdate(CodeSystemDto input)
        {
            try
            {
                var _codeSystemRepos = AppFactory.Repository<CodeSystemEntity, long>();

                if (_codeSystemRepos.Any(x => x.Id != input.Id && x.Code.Trim().ToLower() == input.Code.Trim().ToLower()))
                {
                    return new CommonResultDto<bool>("Mã đã tồn tại");
                }
                
                if (input.Id > 0) //update
                {
                    if (input.ParentId == null) //parent
                    {
                        var listCodeSystems = _codeSystemRepos.Where(x => x.ParentId == input.Id || x.Id == input.Id).ToList(); //get parent + child
                        foreach (var i in listCodeSystems)
                        {
                            if (i.Id == input.Id) // update parent
                            {
                                var updateDataParent = await _codeSystemRepos.GetAsync(input.Id);
                                AppFactory.ObjectMapper.Map(input, updateDataParent);
                                await _codeSystemRepos.UpdateAsync(updateDataParent);
                            }
                            else // update child
                            {
                                i.ParentCode = input.Code;
                                var updateDataChild = await _codeSystemRepos.GetAsync(i.Id);
                                AppFactory.ObjectMapper.Map(i, updateDataChild);
                                await _codeSystemRepos.UpdateAsync(updateDataChild);
                            }
                        }
                    }
                    else //child
                    {
                        if (!string.IsNullOrEmpty(input.ParentCode))
                        {
                            var _codeSystem = _codeSystemRepos.FirstOrDefault(v => v.Code == input.ParentCode);
                            input.ParentCode = _codeSystem != null ? _codeSystem.Code : "";
                        }
                        var updateData = await _codeSystemRepos.GetAsync(input.Id);
                        #region "Cập nhật giá trị Display vào các bảng"
                        if (!input.Display.Trim().ToLower().Equals(updateData.Display.Trim().ToLower()))
                        {
                            var defautDb = AppFactory.TravelTicketDbFactory.Connection;
                            var parameters = new DynamicParameters();

                            StringBuilder sb = new StringBuilder();
                        }
                        #endregion
                        AppFactory.ObjectMapper.Map(input, updateData);
                        await _codeSystemRepos.UpdateAsync(updateData);
                    }
                }
                else
                {
                    //create
                    var insertInput = new CodeSystemEntity();
                    if (!string.IsNullOrEmpty(input.ParentCode))
                    {
                        var _codeSystem = _codeSystemRepos.FirstOrDefault(v => v.Code == input.ParentCode);
                        input.ParentCode = _codeSystem != null ? _codeSystem.Code : "";
                        input.ParentId = _codeSystem != null ? _codeSystem.Id : null;
                    }
                    AppFactory.ObjectMapper.Map(input, insertInput);
                    await _codeSystemRepos.InsertAsync(insertInput);
                }
                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra",
                    ExceptionError = ex.Message
                };
            }
        }

        #region Excel
        public async Task<FileDto> ExportExcelDanhMucChung(ExportExcelCodeSystemRequest req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        public async Task<FileDto> DownloadFTCodeSystem(DownloadFTCodeSystemRequest req)
        {
            return await AppFactory.Mediator.Send(req);
        }

        public async Task<List<CheckValidImportExcelCodeSystemDto>> CheckValidImportExcelDanhMucChung(CheckValidImportExcelCodeSystemRequest input)
        {
            return await AppFactory.Mediator.Send(input);
        }

        public async Task UploadExcelDanhMucChung(UploadExcelCodeSystemRequest input)
        {
            await AppFactory.Mediator.Send(input);
        }
        #endregion Excel

        public async Task<List<CodeSystemDto>> GetAllByParentCode(GetAllByParentCodeRequest input)
        {
            return await AppFactory.Mediator.Send(input);
        }
    }
}