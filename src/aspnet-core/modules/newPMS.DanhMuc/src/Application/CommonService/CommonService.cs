using Dapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.AppConst;
using newPMS.ComboData;
using newPMS.Common.Dtos;
using newPMS.CommonService.Business;
using newPMS.CommonService.Query;
using newPMS.DanhMuc;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using static newPMS.CommonEnum;

namespace newPMS.CommonService
{
    //[Authorize]
    public class CommonService : ApplicationService
    {
        private readonly IOrdAppFactory _factory;
        protected IMediator Mediator => _factory.Mediator;
        private readonly ComboBaseAppService _comBoBaseService;

        public CommonService(IOrdAppFactory factory,
             ComboBaseAppService comBoBaseService)
        {
            _factory = factory;
            _comBoBaseService = comBoBaseService;
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> DanhMucHuyenCombo(HuyenComboboxRequest input)
        {
            return await Mediator.Send(input);
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> DanhMucXaCombo(XaComboboxRequest input)
        {
            return await Mediator.Send(input);
        }
        public List<ItemObj<PHAN_VUNG_TINH>> PhanVungTinh()
        {
            return GetPhanVungTinh();
        }

        public List<ItemObj<TRANG_THAI_BOOKING>> TrangThaiBooking()
        {
            return GetTrangThaiBooking();
        }


        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> DanhMucTinhCombo()
        {
            return await Mediator.Send(new TinhComboboxRequest());
        }


        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> DanhMucPhongBanCombo()
        {
            return await Mediator.Send(new PhongBanComboboxRequest());
        }

        private async Task<List<ComboBoxDto>> DanhMucPhongBanId()
        {
            try
            {

                var query = _factory.Repository<SysOrganizationunits, long>().Select(x => new ComboBoxDto
                {
                    Value = x.Id.ToString(),
                    DisplayText = x.TenPhongBan,
                    Data = new
                    {
                        x.MaPhongBan,
                        x.LoaiPhongBan
                    }
                });

                var res = await query.ToListAsync();

                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        [HttpPost(Utilities.ApiUrlBase + "GetAllUsers")]
        public async Task<List<ComboBoxDto>> GetAllUsers()
        {
            var query = from tb_user in _factory.Repository<SysUserEntity, long>()
                        select new ComboBoxDto()
                        {
                            Value = tb_user.Id,
                            DisplayText = tb_user.HoTen
                        }
                      ;
            return await query.Distinct().ToListAsync();
        }



        [HttpGet(Utilities.ApiUrlBase + "GetOrganizationunitsCombobox")]
        public List<ComboBoxDto> GetOrganizationunitsCombobox()
        {
            var query = (from tb in _factory.Repository<SysOrganizationunits, long>()
                         select new ComboBoxDto()
                         {
                             Value = tb.OrganizationunitsId.ToString(),
                             DisplayText = tb.TenPhongBan,
                             Data = tb.Id
                         }).ToList();
            return query;
        }


        [HttpPost(Utilities.ApiUrlBase + "GetSoChoNgoiXeCombobox")]
        public List<ComboBoxDto> GetSoChoNgoiXeCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "SoChoXe");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetLoaiXeCombobox")]
        public List<ComboBoxDto> GetLoaiXeCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "LoaiXe");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetLoaiTienTeCombobox")]
        public List<ComboBoxDto> GetLoaiTienTeCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "LoaiTienTe");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }


        [HttpPost(Utilities.ApiUrlBase + "GetLoaiHopDongCombobox")]
        public List<ComboBoxDto> GetLoaiHopDongCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "LoaiHopDong");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetLoaiSoChoiXe")]
        public List<ComboBoxDto> GetLoaiSoChoiXe()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "SoChoXe");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetLoaiKhach")]
        public List<ComboBoxDto> GetLoaiKhach()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "LoaiKhachHang");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetFromDataBase")]
        public async Task<List<ComboBoxDto>> GetFromDataBase(GetComboDataFromDataBaseInputDto input)
        {
            input.Format(_factory);
            var result = await GetByTableNameComBoConst(input);
            if (result != null)
            {
                return result;
            }

            // default 
            return await GetByParentCodeSystemConst(input);
        }

        private async Task<List<ComboBoxDto>> GetByParentCodeSystemConst(GetComboDataFromDataBaseInputDto input)
        {
            // có thể chỉ cần khai báo key code bên angular
            return input.TableName switch
            {
                // có thể chỉ cần khai báo key code bên angular
                _ => await Mediator.Send(new GetCodeSytemComboDataRequest
                {
                    ParentCode = input.TableName
                })
            };
        }

        private async Task<List<ComboBoxDto>> GetByTableNameComBoConst(GetComboDataFromDataBaseInputDto input)
        {
            return input.TableName switch
            {
                "PHONG_BAN_ID" => await DanhMucPhongBanId(),
                TableNameComBoConst.TreeOrganizationUnit => await _comBoBaseService.GetTreeOrganizationUnit(),
                _ => null,
            };
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> CodeSystemCombo()
        {
            return await Mediator.Send(new CodeSystemComboboxRequest());
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> DanhMucQuocTichCombo()
        {
            return await Mediator.Send(new QuocTichComboboxRequest());
        }

        [HttpGet(Utilities.ApiUrlBase + "GetQuocGia")]
        public List<ComboBoxDto> GetQuocGia()
        {
            var _repos = _factory.Repository<DanhMucQuocGiaEntity, string>();
            var query = _repos.Select(x =>
                 new ComboBoxDto
                 {
                     Value = x.Id,
                     DisplayText = x.Ten
                 }
            );
            return query.ToList();
        }

    }
}
