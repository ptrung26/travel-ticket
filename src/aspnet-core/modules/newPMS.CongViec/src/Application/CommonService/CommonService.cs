using Dapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using newPMS.CongViec;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using newPMS.Permissions;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ubiety.Dns.Core;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using static newPMS.CommonEnum;
using static Stimulsoft.Report.Func;

namespace newPMS.CommonService
{
    //[Authorize]
    public class CommonService : ApplicationService
    {
        private readonly IOrdAppFactory _factory;
        protected IMediator Mediator => _factory.Mediator;
        private IRepository<SysOrganizationunitsUser, long> _sysOrganizationunitsUserRepos =>
                   _factory.Repository<SysOrganizationunitsUser, long>();
        private IRepository<SysOrganizationunits, long> _sysOrganizationunitsRepos =>
                   _factory.Repository<SysOrganizationunits, long>();
        private IRepository<CongViecEntity, long> _congViecRepos =>
                 _factory.Repository<CongViecEntity, long>();

        public CommonService(IOrdAppFactory factory, IOrdAppFactory appFactory)
        {
            _factory = appFactory;
            _factory = factory;
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public List<ItemObj<TRANG_THAI_CONG_VIEC>> TrangThaiCongViec()
        {
            return GetTrangThaiCongViec();
        }
        [HttpPost(Utilities.ApiUrlActionBase)]
        public List<ItemObj<MUC_DO_CONG_VIEC>> MucDoCongViec()
        {
            return GetMucDoCongViec();
        }
        public List<ItemObj<LEVEL_CONG_VIEC>> LevelCongViec()
        {
            return GetLevelCongViec();
        }

        public List<ItemObj<ROLE_CONG_VIEC>> RoleCongViec()
        {
            return GetRoleCongViec();
        }

        public async Task<List<CongViecUserDto>> GetUserCongViec(int roleCongViec)
        {
            var response = new List<CongViecUserDto>();
            var userSession = _factory.UserSession;

            if (userSession != null)
            {
                //Kiểm tra xem user thuộc những phòng ban nào
                var listSysOrganizationunitsUser = _sysOrganizationunitsUserRepos.Where(x => x.SysUserId == userSession.SysUserId).ToList();
                if (listSysOrganizationunitsUser != null)
                {
                    //Lấy ra tất cả sysUserId của nhân viên trong phòng ban
                    var listSysUserId = _sysOrganizationunitsUserRepos.Where(x =>
                                        listSysOrganizationunitsUser.Select(s => s.SysOrganizationunitsId).Contains(x.SysOrganizationunitsId))?
                                        .Select(s => s.SysUserId).ToList();

                    if (listSysUserId?.Count > 0)
                    {
                        var listRole = new List<CongViecRoleDto>();
                        var u = new List<string>();
                        var r = new List<string>();
                        var groupName = "CongViec.QuanLyCongViec.";
                        switch (roleCongViec)
                        {
                            case (int)ROLE_CONG_VIEC.LANH_DAO:
                                listRole = await GetRoleFormPermission(groupName + "LanhDao");
                                if (listRole?.Count > 0)
                                {
                                    response = await GetListUser(listSysUserId, listRole);
                                }
                                break;
                            case (int)ROLE_CONG_VIEC.TRUONG_PHONG:
                                listRole = await GetRoleFormPermission(groupName + "TruongPhong");
                                if (listRole?.Count > 0)
                                {
                                    response = await GetListUser(listSysUserId, listRole);
                                }
                                break;
                            case (int)ROLE_CONG_VIEC.NHAN_VIEN:
                                listRole = await GetRoleFormPermission(groupName + "NhanVien");
                                if (listRole?.Count > 0)
                                {
                                    response = await GetListUser(listSysUserId, listRole);
                                }
                                break;
                            case (int)ROLE_CONG_VIEC.CA_NHAN:
                                listRole = await GetRoleFormPermission(groupName + "LanhDao");
                                response = await GetListUserCaNhan(listRole);
                                break;
                        }
                    }
                }

            }

            return response;
        }



        private async Task<List<CongViecUserDto>> GetListUserCaNhan(List<CongViecRoleDto> listRole)
        {
            List<string> listR = listRole.Where(x => x.ProviderName == "R")?.Select(s => s.ProviderKey).Distinct().ToList();
            List<string> listU = listRole.Where(x => x.ProviderName == "U")?.Select(s => s.ProviderKey).Distinct().ToList();
            var listIdCongViec = _congViecRepos.Where(x => x.TrangThai == (int)TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN).Select(s => s.Id).ToList();
            var query = new StringBuilder($@" 
                                    SELECT
                                        u.Id,
	                                    u.UserId,
	                                    u.HoTen,
	                                    u.UserName,
	                                    u.Avatar as AnhDaiDien
                                    ");

            if (listIdCongViec?.Count > 0)
            {
                query.AppendLine($@" , (
		                                SELECT Count( Id )
	                                FROM
		                                cv_congviecuser
	                                WHERE
		                                IsDeleted = 0 
		                                and CongViecId IN (	{string.Join(",", listIdCongViec)} )
		                                AND SysUserId = u.Id 
	                                ) AS SoCongViecDangThucHien ");
            }

            query.Append($@"    FROM
	                                sysuser u
	                                JOIN sysuserrole sur ON u.Id = sur.SysUserId
	                                JOIN sysrole sr ON sur.SysRoleId = sr.Id 
	                                AND sr.IsDeleted = 0
                                WHERE
	                                u.IsDeleted = 0
                                  
                                ");

            if (listR?.Count > 0 && listU?.Count > 0)
            {
                query.Append($" AND ( sr.Ma NOT IN ({string.Join(",", listR.Select(s => $"'{s}'"))}) OR u.UserId IN ({string.Join(",", listU.Select(s => $"'{s}'"))}) )");
            }
            else if (listR?.Count > 0)
            {
                query.Append($" AND sr.Ma NOT IN ({string.Join(",", listR.Select(s => $"'{s}'"))}) ");
            }
            else if (listU?.Count > 0)
            {
                query.Append($" u.UserId NOT IN ({string.Join(",", listU.Select(s => $"'{s}'"))}) ");
            }

            query.Append(" GROUP BY u.Id, u.HoTen");

            // Những người đang nhận công việc ít nhất sẽ xếp lên đầu
            if (listIdCongViec?.Count > 0)
            {
                query.Append(" order by SoCongViecDangThucHien asc");
            }

            var response = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecUserDto>(query.ToString())).ToList();

            return response;
        }



        private async Task<List<CongViecRoleDto>> GetRoleFormPermission(string permission)
        {
            var response = new List<CongViecRoleDto>();
            var queryRole = new StringBuilder($@"SELECT
	                                            Id as Id,
	                                            `Name` as Name,
	                                            ProviderName as ProviderName,
	                                            ProviderKey as ProviderKey
                                            FROM
	                                            `abppermissiongrants` 
                                            WHERE
	                                            `Name` = '{permission}' 
                                                ");
            response = (await _factory.DefaultDbFactory.Connection.QueryAsync<CongViecRoleDto>(queryRole.ToString())).ToList();
            return response;
        }

        private async Task<List<CongViecUserDto>> GetListUser(List<long> listSysUserId, List<CongViecRoleDto> listRole)
        {
            List<string> listR = listRole.Where(x => x.ProviderName == "R")?.Select(s => s.ProviderKey).Distinct().ToList();
            List<string> listU = listRole.Where(x => x.ProviderName == "U")?.Select(s => s.ProviderKey).Distinct().ToList();
            var response = new List<CongViecUserDto>();
            var listIdCongViec = _congViecRepos.Where(x => x.TrangThai == (int)TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN).Select(s => s.Id).ToList();

            var query = new StringBuilder($@" 
                                    SELECT
                                        u.Id,
	                                    u.UserId,
	                                    u.HoTen,
	                                    u.UserName,
	                                    u.Avatar as AnhDaiDien
                                    ");

            if (listIdCongViec?.Count > 0)
            {
                query.AppendLine($@" , (
		                                SELECT Count( Id )
	                                FROM
		                                cv_congviecuser
	                                WHERE
		                                IsDeleted = 0 
		                                and CongViecId IN (	{string.Join(",", listIdCongViec)} )
		                                AND SysUserId = u.Id 
	                                ) AS SoCongViecDangThucHien ");
            }

            query.Append($@"    FROM
	                                sysuser u
	                                JOIN sysuserrole sur ON u.Id = sur.SysUserId
	                                JOIN sysrole sr ON sur.SysRoleId = sr.Id 
	                                AND sr.IsDeleted = 0
                                WHERE
	                                u.IsDeleted = 0
                                    AND u.Id IN ({string.Join(",", listSysUserId)})
                                ");

            if (listR?.Count > 0 && listU?.Count > 0)
            {
                query.Append($" AND ( sr.Ma IN ({string.Join(",", listR.Select(s => $"'{s}'"))}) OR u.UserId IN ({string.Join(",", listU.Select(s => $"'{s}'"))}) )");
            }
            else if (listR?.Count > 0)
            {
                query.Append($" AND sr.Ma IN ({string.Join(",", listR.Select(s => $"'{s}'"))}) ");
            }
            else if (listU?.Count > 0)
            {
                query.Append($" u.UserId IN ({string.Join(",", listU.Select(s => $"'{s}'"))}) ");
            }

            query.Append(" GROUP BY u.Id, u.HoTen");

            // Những người đang nhận công việc ít nhất sẽ xếp lên đầu
            if (listIdCongViec?.Count > 0)
            {
                query.Append(" order by SoCongViecDangThucHien asc");
            }

                response = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecUserDto>(query.ToString())).ToList();

            return response;
        }
        //[HttpGet(Utilities.ApiUrlActionBase)]
        //public async Task<List<ComboBoxDto>> NhanVienQLCLCombobox()
        //{
        //    return await Mediator.Send(new NhanVienQLCLComboboxRequest());
        //}
       
    }
    
}