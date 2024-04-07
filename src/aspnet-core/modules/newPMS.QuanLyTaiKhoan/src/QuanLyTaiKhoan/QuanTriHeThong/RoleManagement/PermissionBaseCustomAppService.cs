using Dapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.Entities;
using newPMS.QuanTriHeThong.Dtos;
using Newtonsoft.Json;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.ObjectExtending;
using Volo.Abp.PermissionManagement;

namespace newPMS.QuanLyTaiKhoan.Services
{
    public interface IPermissionBaseCustomAppService : IApplicationService
    {
        Task<GetPermissionListResultDto> GetAllPermission();
        Task<SysRolePermissionDto> GetPermissionsBySysRoleId(long SysRoleId);
        Task<SysUserRolePermissionDto> GetPermissionsBySysUser(long sysUserId);

        Task<IdentityRoleDto> InsertAbpRole(IdentityRoleCreateDto RoleDto);
        Task<int> SetPermissionForSysRole(long SysRoleId, List<string> PermissionNames);
        Task<CommonResultDto<bool>> SetPermissionForUser(long sysUser, List<string> PermissionNamesInsert, List<string> PermissionNamesRemove);

    }
    [Authorize]
    public class PermissionBaseCustomAppService : QuanLyTaiKhoanAppService, IPermissionBaseCustomAppService
    {
        private readonly IOrdAppFactory _factory;
        private readonly ICurrentTenant _currentTenant;
        protected IPermissionManager PermissionManager;
        protected IPermissionDefinitionManager PermissionDefinitionManager;
        private readonly IRepository<SysRoleEntity, long> _roleRepos;
        private readonly IGuidGenerator _guidGenerator;
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;
        private readonly IAuthorizationService _authorizationService;

        public PermissionBaseCustomAppService(
            IOrdAppFactory factory,
             ICurrentTenant currentTenant,
             IRepository<SysRoleEntity, long> roleRepos,
             IGuidGenerator guidGenerator,
             IConfiguration configuration,
             ILogger<PermissionBaseCustomAppService> logger)
        {
            _currentTenant = currentTenant;
            _factory = factory;
            PermissionManager = factory.GetServiceDependency<IPermissionManager>();
            PermissionDefinitionManager = factory.GetServiceDependency<IPermissionDefinitionManager>();
            _roleRepos = roleRepos;
            _guidGenerator = guidGenerator;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<GetPermissionListResultDto> GetAllPermission()
        {
            var providerName = "R";
            var providerKey = "A";
            var result = new GetPermissionListResultDto
            {
                EntityDisplayName = "R",
                Groups = new List<PermissionGroupDto>()
            };

            var multiTenancySide = GetMultiTenancySide();

            foreach (var group in PermissionDefinitionManager.GetGroups())
            {
                var groupDto = new PermissionGroupDto
                {
                    Name = group.Name,
                    DisplayName = group.Name,
                    Permissions = new List<PermissionGrantInfoDto>()
                };

                foreach (var permission in group.GetPermissionsWithChildren())
                {
                    if (!permission.IsEnabled)
                    {
                        continue;
                    }

                    if (permission.Providers.Any() && !permission.Providers.Contains(providerName))
                    {
                        continue;
                    }

                    if (!permission.MultiTenancySide.HasFlag(multiTenancySide))
                    {
                        continue;
                    }

                    var grantInfoDto = new PermissionGrantInfoDto
                    {
                        Name = permission.Name,
                        DisplayName = permission.Name,
                        ParentName = permission.Parent?.Name,
                        AllowedProviders = permission.Providers,
                        GrantedProviders = new List<ProviderInfoDto>()
                    };

                    var grantInfo = await PermissionManager.GetAsync(permission.Name, providerName, providerKey);

                    grantInfoDto.IsGranted = grantInfo.IsGranted;

                    foreach (var provider in grantInfo.Providers)
                    {
                        grantInfoDto.GrantedProviders.Add(new ProviderInfoDto
                        {
                            ProviderName = provider.Name,
                            ProviderKey = provider.Key,
                        });
                    }

                    groupDto.Permissions.Add(grantInfoDto);
                }

                if (groupDto.Permissions.Any())
                {
                    result.Groups.Add(groupDto);
                }
            }
#if DEBUG
            var logPer = new StringBuilder();
            foreach (var g in result.Groups)
            {
                logPer.Append(@$"'{g.Name}':'', 
");
                foreach (var p in g.Permissions)
                {
                    logPer.Append(@$"'{p.Name}':'', 
");
                }
            }
            _logger.LogDebug(logPer.ToString());

#endif

            return result;
        }
        public async Task<SysRolePermissionDto> GetPermissionsBySysRoleId(long SysRoleId)
        {

            var ret = new SysRolePermissionDto()
            {
                SysRoleId = SysRoleId
            };
            var sysRole = await _roleRepos.GetAsync(SysRoleId);
            var abpRoleId = sysRole.RoleId;
            var roleName = await GetRoleName(abpRoleId);
            ret.PermissionNames = (await _factory.DefaultDbFactory.Connection.QueryAsync<string>(
                $@"SELECT Name FROM AbpPermissionGrants WHERE ProviderName ='R' and ProviderKey = '{roleName}'"
                )).ToList();
            return ret;
        }

        #region GetPermissionUser
        //Lấy quyền của user
        public async Task<SysUserRolePermissionDto> GetPermissionsBySysUser(long sysUserId)
        {
            var response = new SysUserRolePermissionDto();
            response.SysUserId = sysUserId;
            var sysUser = _factory.Repository<SysUserEntity, long>().FirstOrDefault(x => x.Id == sysUserId);
            var sysRoles =
                    (from sys in _factory.Repository<SysUserEntity, long>().Where(x => x.Id == sysUserId)
                     join sur in _factory.Repository<SysUserRoleEntity, long>() on sys.Id equals sur.SysUserId
                     join sr in _factory.Repository<SysRoleEntity, long>() on sur.SysRoleId equals sr.Id
                     select sr.Ma).ToList();

            if( sysRoles?.Count > 0)
            {
                foreach(var i in sysRoles)
                {
                    response.PermissionNamesRole.AddRange((await _factory.DefaultDbFactory.Connection.QueryAsync<string>(
                $@" SELECT Name FROM AbpPermissionGrants WHERE ( ProviderName ='R' and ProviderKey = '{i}' )
                ")).ToList());
                }
            }

            var permissionUser = (await _factory.DefaultDbFactory.Connection.QueryAsync<string>(
                $@" SELECT Name FROM AbpPermissionGrants WHERE ProviderName ='U' and ProviderKey = '{sysUser.UserId}'
                ")).ToList();
            foreach (var i in permissionUser)
            {
                if (response.PermissionNamesRole.FirstOrDefault(x => x == i) == null)
                {
                    response.PermissionNamesUser.Add(i);
                }
            }
            return response;
        }

        //Lấy tất cả quyền
        public async Task<GetPermissionListResultDto> GetAllByRoleSysUser()
        {
            var _IPermissionBaseCustom = _factory.GetServiceDependency<IPermissionBaseCustomAppService>();
            var allPermission = await _IPermissionBaseCustom.GetAllPermission();

            foreach (var g in allPermission.Groups)
            {
                if (g.Permissions?.Any() == true)
                {
                    g.Permissions = g.Permissions.ToList();
                }
            }
            return allPermission;
        }

        #endregion

        private Task<string> GetRoleName(Guid roleAbpId)
        {
            return _factory.DefaultDbFactory.Connection.QueryFirstAsync<string>(
                $@"SELECT Name from AbpRoles WHERE id = @Id", new
                {
                    Id = roleAbpId
                });
        }

        public async Task<IdentityRoleDto> InsertAbpRole(IdentityRoleCreateDto RoleDto)
        {
            try
            {
                var roleManager = _factory.GetServiceDependency<IdentityRoleManager>();
                IdentityRoleCreateDto input = RoleDto;
                var role = new IdentityRole(
                    _guidGenerator.Create(),
                   RoleDto.Name,
                    null
                )
                {
                    IsDefault = input.IsDefault,
                    IsPublic = input.IsPublic
                };

                input.MapExtraPropertiesTo(role);
                await roleManager.CreateAsync(role);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();
                return _factory.ObjectMapper.Map<IdentityRole, IdentityRoleDto>(role);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async Task<Unit> RefreshCacheRolePermission(string RoleName)
        {
            try
            {
                var taiKhoanUrl = _configuration["AuthServer:UrlTaiKhoan"];
                if (!string.IsNullOrEmpty(taiKhoanUrl))
                {
                    taiKhoanUrl = taiKhoanUrl.Trim().TrimEnd('/');
                    var permissions = await _factory.DefaultDbFactory.Connection.QueryAsync<string>("SELECT DISTINCT(Name) from AbpPermissionGrants");
                    var client =
                        new RestClient($"{taiKhoanUrl}/api/tai-khoan/refresh-cache-permission/refresh-for-role")
                        { Timeout = -1 };
                    var restRequest = new RestRequest(Method.POST);
                    restRequest.AddHeader("Content-Type", "application/json");
                    var body = new RefreshPermissionForRoleDto()
                    {
                        RoleName = RoleName,
                        ListOfPermissions = permissions.ToList()
                    };
                    restRequest.AddParameter("application/json", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
                    IRestResponse response = await client.ExecuteAsync(restRequest);
                }

                return Unit.Value;
            }
            catch
            {
                return Unit.Value;
            }
        }

        public async Task<int> SetPermissionForSysRole(long SysRoleId, List<string> PermissionNames)
        {
            try
            {
                var sysRole = await _roleRepos.GetAsync(SysRoleId);
                var abpRoleId = sysRole.RoleId;
                var roleName = await _factory.DefaultDbFactory.Connection.QueryFirstAsync<string>(
                    $@"SELECT Name from AbpRoles WHERE id = @Id", new
                    {
                        Id = abpRoleId
                    });
                if (!string.IsNullOrEmpty(roleName))
                {
                    var db = _factory.DefaultDbFactory;
                    using var tranc = db.DbTransaction;
                    await db.Connection.ExecuteAsync(
                        $@"DELETE  from AbpPermissionGrants WHERE ProviderName ='R' and ProviderKey = @RoleName",
                        new
                        {
                            RoleName = roleName
                        }, transaction: tranc);

                    if (PermissionNames?.Any() == true)
                    {

                        var prms = PermissionNames.Select(p => new
                        {
                            Id = _guidGenerator.Create(),
                            PermissionName = p,
                            RoleName = roleName,
                            ProviderName = RolePermissionValueProvider.ProviderName
                        });
                        await db.Connection.ExecuteAsync(
                            $@"INSERT INTO AbpPermissionGrants
                        (Id, TenantId, Name, ProviderName, ProviderKey)
                        VALUES
                        (@Id, NULL, @PermissionName, @ProviderName, @RoleName)"
                            , prms
                            , transaction: tranc);
                    }
                    tranc.Commit();
                }

                await RefreshCacheRolePermission(roleName);
                return PermissionNames?.Count ?? 0;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<CommonResultDto<bool>> SetPermissionForUser(long sysUSer, List<string> PermissionNamesInsert, List<string> PermissionNamesRemove)
        {
            try
            {
                var sysUserObject = _factory.Repository<SysUserEntity, long>().FirstOrDefault(x => x.Id == sysUSer);
                if (sysUserObject != null && PermissionNamesInsert.Any() == true)
                {
                    var prms = PermissionNamesInsert.Select(p => new
                    {
                        Id = _guidGenerator.Create(),
                        PermissionName = p,
                        RoleName = sysUserObject.UserId,
                        ProviderName = "U"
                    });

                    await _factory.DefaultDbFactory.Connection.ExecuteAsync(
                            $@"INSERT INTO AbpPermissionGrants
                        (Id, TenantId, Name, ProviderName, ProviderKey)
                        VALUES
                        (@Id, NULL, @PermissionName, @ProviderName, @RoleName)"
                            , prms);
                }
                if (sysUserObject != null && PermissionNamesRemove.Any() == true)
                {
                    var prms = PermissionNamesRemove.Select(p => new
                    {
                        PermissionName = p,
                        ProviderName = "U",
                        RoleName = sysUserObject.UserId,
                    });

                    await _factory.DefaultDbFactory.Connection.ExecuteAsync(
                            $@"DELETE FROM AbpPermissionGrants
                       WHERE (Name, ProviderName, ProviderKey)
                        IN(
                        (@PermissionName, @ProviderName, @RoleName))"
                            , prms);
                }
                await RefreshCacheUserPermission(sysUserObject.UserId.ToString());
                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };

            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra!"
                };
            }
        }

        private async Task<Unit> RefreshCacheUserPermission(string UserName)
        {
            try
            {
                var identityUrl = _configuration["AuthServer:Authority"];
                if (!string.IsNullOrEmpty(identityUrl))
                {
                    identityUrl = identityUrl.Trim().TrimEnd('/');
                    var permissions = await _factory.DefaultDbFactory.Connection.QueryAsync<string>("SELECT DISTINCT(Name) from AbpPermissionGrants");
                    var client =
                        new RestClient($"{identityUrl}/api/app/refresh-cache-permission/refresh-for-user")
                        { Timeout = -1 };
                    var restRequest = new RestRequest(Method.POST);
                    restRequest.AddHeader("Content-Type", "application/json");
                    var body = new RefreshPermissionForUserDto()
                    {
                        UserName = UserName,
                        ListOfPermissions = permissions.ToList()
                    };
                    restRequest.AddParameter("application/json", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
                    IRestResponse response = await client.ExecuteAsync(restRequest);
                }

                return Unit.Value;
            }
            catch
            {
                return Unit.Value;
            }
        }


        private MultiTenancySides GetMultiTenancySide()
        {
            return _currentTenant.Id.HasValue
                ? MultiTenancySides.Tenant
                : MultiTenancySides.Host;
        }
    }
}
