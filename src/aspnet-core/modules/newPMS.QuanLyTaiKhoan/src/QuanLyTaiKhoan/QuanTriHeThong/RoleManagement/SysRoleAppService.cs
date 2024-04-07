using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.Entities;
using newPMS.QuanTriHeThong.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using static newPMS.CommonEnum;

namespace newPMS.QuanLyTaiKhoan.Services
{
    //[Authorize(QuanTriHeThongPermissions.Role)]
    [Authorize]
    public class SysRoleAppService : QuanLyTaiKhoanAppService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IRepository<SysRoleEntity, long> _roleRepository;
        private readonly IRepository<SysRoleLevelEntity, long> _roleLevelRepository;
        //private readonly IObjectMapper<QuanLyTaiKhoanApplicationModule> _objectMapper;
        private readonly IPermissionBaseCustomAppService _permissionBaseCustomAppService;

        public SysRoleAppService(IOrdAppFactory factory,
            IRepository<SysRoleEntity, long> roleRepository,
             IRepository<SysRoleLevelEntity, long> roleLevelRepository,
        //IObjectMapper<QuanLyTaiKhoanApplicationModule> objectMapper,
        IPermissionBaseCustomAppService permissionBaseCustomAppService)
        {
            _factory = factory;
            _roleRepository = roleRepository;
            _roleLevelRepository = roleLevelRepository;
            //_objectMapper = objectMapper;
            _permissionBaseCustomAppService = permissionBaseCustomAppService;
        }

        //public Task<int> SetPermissionForSysRole(SetPermissionForSysRoleRequest input)
        //{
        //    return _factory.Mediator.Send(input);
        //}  
        public async Task<int> SetPermissionForSysRole(InputSetPermissionForSysRoleDto input)
        {
            var result = await _permissionBaseCustomAppService.SetPermissionForSysRole(input.SysRoleId, input.PermissionNames);
            return result;
        }

        public async Task<CommonResultDto<bool>> SetPermissionForUser(InputSetPermissionForSysUserDto input)
        {
            var result = await _permissionBaseCustomAppService.SetPermissionForUser(input.SysUserId, input.PermissionNamesInsert, input.PermissionNamesRemove);
            return result;
        }

        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<SysRolePermissionDto> GetPermissionGranted(long sysRoleId)
        {
            var result = await _permissionBaseCustomAppService.GetPermissionsBySysRoleId(sysRoleId);
            return result;
            //    return _factory.Mediator.Send(new GetPermissionsBySysRoleIdRequest
            //    {
            //        SysRoleId = sysRoleId
            //    });
        }

        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<SysUserRolePermissionDto> GetPermissionGrantedForUser(long sysUserId)
        {
            var result = await _permissionBaseCustomAppService.GetPermissionsBySysUser(sysUserId);
            return result;
        }
        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<PagedResultDto<SysRoleDto>> GetListRoleCoSo(RoleCoSoPagedInputDto input)
        {

            try
            {
                var textSearch = input.Filter.LikeTextSearch();
                var queryDto = _roleRepository.AsNoTracking().Where(x => !x.Ma.ToLower().Equals("adminx"))
                  .WhereIf(!string.IsNullOrEmpty(input.Filter), x => EF.Functions.Like(x.Ma.Replace("đ", "d").Replace("Đ", "d"), textSearch)
                                                                  || EF.Functions.Like(x.Ten.Replace("đ", "d").Replace("Đ", "d"), textSearch))

                    .Select(x => new SysRoleDto()
                    {
                        Id = x.Id,
                        Ten = x.Ten,
                        Ma = x.Ma,
                    }).OrderByDescending(x => x.Id);
                var result = await queryDto.GetPagedAsync<SysRoleDto>(input.SkipCount, input.MaxResultCount);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public async Task<CommonResultDto<bool>> UpsertRoleCoSo(SysRoleDto input)
        {
            input.IsStatic = true;
            input.Ma = input.Ma.Replace(" ", "");

            if (input.Id > 0)
            {
                return await Update(input);
            }

            return await Insert(input);
        }

        private async Task<CommonResultDto<bool>> Insert(SysRoleDto input)
        {
            var ret = new CommonResultDto<bool>();
            try
            {
                input.Ma = input.Ma.Trim();
                var isExistMa = await _roleRepository.AnyAsync(x => string.IsNullOrEmpty(input.Ma) || x.Ma.ToLower().Trim() == input.Ma.Trim().ToLower());

                if (isExistMa)
                {
                    ret.IsSuccessful = false;
                    ret.ErrorMessage = $"Đã có quyền với mã : {input.Ma} trên hệ thống";
                    return ret;
                }

                var sysRole = _factory.ObjectMapper.Map<SysRoleDto, SysRoleEntity>(input);

                var insert = new IdentityRoleCreateDto()
                {
                    Name = GetNameAbpRole(sysRole.Ma),
                    IsDefault = false,
                    IsPublic = true
                };

                var roleDto = await _permissionBaseCustomAppService.InsertAbpRole(insert);
                sysRole.RoleId = roleDto.Id;
                await _roleRepository.InsertAsync(sysRole);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();

                ret.IsSuccessful = true;
            }
            catch (Exception ex)
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra";
            }

            return ret;
        }

        private async Task<CommonResultDto<bool>> Update(SysRoleDto input)
        {
            var ret = new CommonResultDto<bool>();
            try
            {
                var sysRole = await _roleRepository.FirstOrDefaultAsync(x => x.Ma == input.Ma);

                if (sysRole != null && sysRole.Id != input.Id)
                {
                    ret.IsSuccessful = false;
                    ret.ErrorMessage = $"Đã có quyền với mã : {input.Ma} trên hệ thống";
                    return ret;
                }

                var updateSysRole = await _roleRepository.GetAsync(input.Id);
                if (!String.Equals(updateSysRole.Ma, input.Ma, StringComparison.CurrentCultureIgnoreCase))
                {
                    updateSysRole.Ma = input.Ma;
                    // update Name cho abp role
                    IdentityRoleManager roleManager = _factory.GetServiceDependency<IdentityRoleManager>();
                    var roleEnt = await roleManager.GetByIdAsync(updateSysRole.RoleId);
                    await roleManager.SetRoleNameAsync(roleEnt, GetNameAbpRole(updateSysRole.Ma));
                    await roleManager.UpdateAsync(roleEnt);
                }
                updateSysRole.Ten = input.Ten;
                updateSysRole.IsDefault = input.IsDefault;
                updateSysRole.Level = input.Level;
                await _roleRepository.UpdateAsync(updateSysRole);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();

                ret.IsSuccessful = true;
            }
            catch
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra";
            }

            return ret;
        }

        private string GetNameAbpRole(string ma)
        {
            return $@"{ma}";
        }

        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<SysRoleDto> GetByIdAsync(long id)
        {
            var ent = await _factory.Repository<SysRoleEntity, long>().GetAsync(id);
            var dto = _factory.ObjectMapper.Map<SysRoleEntity, SysRoleDto>(ent);
            return dto;
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> XoaRoleCoSo(long sysRoleId)
        {
            var ret = new CommonResultDto<bool>();
            try
            {
                var checkUseRole = await _factory.Repository<SysUserRoleEntity, long>()
               .AsNoTracking().AnyAsync(x => x.SysRoleId == sysRoleId);
                if (checkUseRole)
                {
                    ret.IsSuccessful = false;
                    ret.ErrorMessage = "Đang có tài khoản sử dụng quyền này";
                }

                var role = await _roleRepository.FindAsync(x => x.Id == sysRoleId);
                if (role != null)
                {
                    var abpRoleId = role.RoleId;
                    var abpRoleName = await GetAbpRoleName(abpRoleId);
                    await DeleteAbpRole(abpRoleId, abpRoleName);
                    await _roleRepository.DeleteAsync(sysRoleId);
                }

                ret.IsSuccessful = true;
            }
            catch
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau";
            }

            return ret;
        }


        private Task<string> GetAbpRoleName(Guid id)
        {
            return _factory.DefaultDbFactory.Connection.QueryFirstAsync<string>($@"select Name from AbpRoles WHERE Id = '{id.ToString()}'");
        }

        private async Task DeleteAbpRole(Guid id, string abpRoleName)
        {
            var db = _factory.DefaultDbFactory;
            using var trans = db.DbTransaction;
            try
            {
                await db.Connection.ExecuteAsync(
                    $@"DELETE FROM AbpPermissionGrants WHERE ProviderName ='R' and ProviderKey = @RoleName",
                    new
                    {
                        RoleName = abpRoleName
                    }, transaction: trans);
                await db.Connection.ExecuteAsync(
                    $@"DELETE FROM AbpRoles WHERE Id = @Id",
                    new
                    {
                        Id = id
                    }, transaction: trans);
                trans.Commit();
            }
            catch
            {
                trans.Rollback();
            }

        }


        #region Cấu hình role

        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<List<CauHinhRoleDto>> GetConfigRoleLevel()
        {
            var arrRole = await (from role in _roleRepository
                                 select new CauHinhRoleDto
                                 {
                                     Id = role.Id,
                                     IsDefault = role.IsDefault ?? false,
                                     RoleName = role.Ten,
                                 }).ToListAsync();
            var getAllRoleLevel = await _roleLevelRepository.ToListAsync();

            foreach (var item in arrRole)
            {
                var listLevel = GetListLevel(typeof(LEVEL));
                foreach (var level in listLevel)
                {
                    level.RoleId = item.Id;
                    var roleLevel = getAllRoleLevel.FirstOrDefault(m => m.SysRoleId == item.Id && m.Level == level.Level);
                    level.IsActive = roleLevel != null ? true : false;
                }
                item.ListRoleLevel = listLevel;
            }


            return arrRole;
        }

        private static List<RoleLevelDto> GetListLevel(Type TypeObject)
        {
            List<RoleLevelDto> objTemList = new List<RoleLevelDto>();
            foreach (object iEnumItem in Enum.GetValues(TypeObject))
            {
                RoleLevelDto objTem = new RoleLevelDto();
                objTem.Id = ((int)iEnumItem);
                objTem.Level = ((int)iEnumItem);
                objTem.NameLevel = CommonEnum.GetEnumDisplayString(iEnumItem.GetType(), iEnumItem.ToString());
                objTemList.Add(objTem);
            }
            return objTemList;
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<long>> UpdateConfigPhanQuyen(RoleInputDto input)
        {
            //delete config old
            await _roleLevelRepository.DeleteAsync(m => m.Id > 0);

            //update config new
            if (input.ArrRoleLevelConfig != null && input.ArrRoleLevelConfig.Count() > 0)
            {
                foreach (var item in input.ArrRoleLevelConfig)
                {
                    foreach (var roleLevel in item.ListRoleLevel)
                    {
                        if (roleLevel.IsActive == true)
                        {
                            var obj = new SysRoleLevelEntity();
                            obj.Level = (int)roleLevel.Level;
                            obj.SysRoleId = item.Id;
                            await _roleLevelRepository.InsertAsync(obj);
                        }

                    }
                }
            }
            await _factory.CurrentUnitOfWork.SaveChangesAsync();
            return new CommonResultDto<long>(1);
        }
        #endregion

    }
}
