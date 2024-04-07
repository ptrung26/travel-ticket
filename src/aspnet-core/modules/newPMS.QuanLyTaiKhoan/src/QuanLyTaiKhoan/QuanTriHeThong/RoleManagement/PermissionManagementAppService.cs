using Dapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using newPMS.Entities;
using newPMS.Permissions;
using newPMS.QuanLyTaiKhoan.Dtos;
using Newtonsoft.Json;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Guids;
using Volo.Abp.PermissionManagement;

namespace newPMS.QuanLyTaiKhoan.Services
{
    [Authorize]
    public class PermissionManagementAppService : QuanLyTaiKhoanAppService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IAuthorizationService _authorizationService;
        protected IPermissionDefinitionManager _permissionDefinitionManager;
        private readonly IGuidGenerator _guidGenerator;
        private readonly IConfiguration _configuration;

        public PermissionManagementAppService(IOrdAppFactory factory,
                                              IConfiguration configuration,
                                              IGuidGenerator guidGenerator,
                                              IAuthorizationService authorizationService,
                                              IPermissionDefinitionManager permissionDefinitionManager
                                             )
        {
            _factory = factory;
            _authorizationService = authorizationService;
            _permissionDefinitionManager = permissionDefinitionManager;
            _guidGenerator = guidGenerator;
            _configuration = configuration;
        }


        /// <summary>
        /// isRoleStatic là get cho màn hình cấu hình quyền chung hệ thống
        /// </summary>
        /// <param name="isRoleStatic"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<GetPermissionListResultDto> GetByRoleAsync(GetPermissionInputDto input)
        {
            // var allPermission = await _permissionAppService.GetAsync("R", "R");
            //var allPermission = await _factory.Mediator.Send(new GetAllPermissionRequest());
            var _IPermissionBaseCustom = _factory.GetServiceDependency<IPermissionBaseCustomAppService>();
            var allPermission = await _IPermissionBaseCustom.GetAllPermission();
            if (input.IsRoleStatic)
            {
                var checkRoleStatic = await _authorizationService.AuthorizeAsync(SuperAdminPermissions.RoleStatic);
                if (checkRoleStatic.Succeeded)
                {
                    return allPermission;
                }
                return new GetPermissionListResultDto();
            }


            foreach (var g in allPermission.Groups)
            {
                if (g.Permissions?.Any() == true)
                {
                    g.Permissions = g.Permissions.ToList();
                    //g.Permissions = g.Permissions.Where(x => permissionAble.Contains(x.Name)).ToList();
                }

            }

            allPermission.Groups = allPermission.Groups.Where(g => g.Permissions?.Any() == true).ToList();
            return allPermission;
        }

        #region Permission User
        [HttpGet]
        public async Task<CommonResultDto<List<TreeNodePermissionNameDto>>> GetPermissionUser(long sysUserId)
        {
            var ret = new CommonResultDto<List<TreeNodePermissionNameDto>>();
            try
            {
                var list = new List<TreeNodePermissionNameDto>();
                var listRoleForUser = GetRoleForUser(sysUserId);
                var listPermissionForRole = await GetGrandtedPemissionForRole(listRoleForUser);
                var listPermissionUser = await GetGrandtedPemissionForUser(_factory.Repository<SysUserEntity, long>().FirstOrDefault(x => x.Id == sysUserId).UserId);
                foreach (var group in _permissionDefinitionManager.GetGroups())
                {
                    var treeNode = new TreeNodePermissionNameDto();
                    treeNode.Title = group.Name;
                    treeNode.ListTreePermission = new List<TreePermissionDto>();
                    GetTreePermissionForUser(treeNode, group, listPermissionUser, listPermissionForRole);
                    list.Add(treeNode);
                }

                if (list?.Count > 0)
                {
                    foreach (var item in list)
                    {
                        if (item.ListTreePermission?.Count > 0)
                        {
                            foreach (var p in item.ListTreePermission)
                            {
                                SetIsHalfCheckedTreePermission(p);
                            }
                        }
                    }
                }

                ret.IsSuccessful = true;
                ret.DataResult = list;

            }
            catch (Exception ex)
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau!";
            }

            return ret;
        }

        private void GetTreePermissionForUser(
            TreeNodePermissionNameDto ret,
            PermissionGroupDefinition permissionGroup,
            List<string> permissionUser,
            List<string> listPermissionForRole
            )
        {
            if (permissionGroup?.Permissions?.Count > 0)
            {

                foreach (var permission in permissionGroup?.Permissions)
                {
                    var child = new TreePermissionDto();
                    child.Children = new List<TreePermissionDto>();

                    if (permission.Children?.Count > 0)
                    {
                        if (permission.Children?.Count > 0)
                        {
                            GetChildPermissionForUser(child, new List<PermissionDefinition>(permission.Children), permissionUser, listPermissionForRole);
                        }
                    }

                    child.Title = permission.Name;
                    child.Key = permission.Name;
                    child.IsLeaf = permission.Children?.Count <= 0;
                    child.Checked = permissionUser.Contains(permission.Name) || listPermissionForRole.Contains(permission.Name);
                    child.Expanded = true;
                    child.DisableCheckbox = listPermissionForRole.Contains(permission.Name);
                    ret.ListTreePermission.Add(child);
                }
            }
        }

        public void GetChildPermissionForUser(
            TreePermissionDto ret,
            List<PermissionDefinition> lisPermission,
             List<string> permissionUser,
            List<string> listPermissionForRole
            )
        {
            foreach (var permission in lisPermission)
            {
                var child = new TreePermissionDto();
                child.Children = new List<TreePermissionDto>();
                if (permission.Children?.Count > 0)
                {
                    foreach (var permissionChild in permission.Children)
                    {
                        var childNext = new TreePermissionDto();
                        childNext.Children = new List<TreePermissionDto>();
                        if (permissionChild.Children?.Count > 0)
                        {
                            GetChildPermissionForUser(childNext, new List<PermissionDefinition>(permissionChild.Children), permissionUser, listPermissionForRole);
                        }

                        childNext.Title = permissionChild.Name;
                        childNext.Key = permissionChild.Name;
                        childNext.IsLeaf = permissionChild.Children?.Count <= 0;
                        childNext.Checked = permissionUser.Contains(permissionChild.Name) || listPermissionForRole.Contains(permissionChild.Name);
                        childNext.Expanded = true;
                        childNext.DisableCheckbox = listPermissionForRole.Contains(permissionChild.Name);
                        child.Children.Add(childNext);
                    }
                }

                child.Title = permission.Name;
                child.Expanded = true;
                child.Key = permission.Name;
                child.IsLeaf = permission.Children?.Count <= 0;
                child.Checked = permissionUser.Contains(permission.Name) || listPermissionForRole.Contains(permission.Name);
                child.DisableCheckbox = listPermissionForRole.Contains(permission.Name);
                ret.Children.Add(child);
            }
        }

        private List<string> GetRoleForUser(long sysUserId)
        {
            var listSysRoleId = _factory.Repository<SysUserRoleEntity, long>().Where(x => x.SysUserId == sysUserId).Select(x => x.SysRoleId).ToList();
            return _factory.Repository<SysRoleEntity, long>().Where(x => listSysRoleId.Contains(x.Id)).Select(x => x.Ma).ToList();
        }

        private async Task<List<string>> GetGrandtedPemissionForUser(Guid guidId)
        {
            var query = $@" Select Name from  AbpPermissionGrants Where ProviderKey = '{guidId}' and ProviderName = 'U'";
            var reponse = await _factory.DefaultDbFactory.Connection.QueryAsync<string>(query.ToString());
            return reponse.ToList();
        }

        [HttpPut]
        public async Task<CommonResultDto<bool>> UpdatePermissionUser(UpdatePermissionUserDto input)
        {
            var ret = new CommonResultDto<bool>();
            try
            {
                var userId = _factory.Repository<SysUserEntity, long>().FirstOrDefault(x => x.Id == input.SysUserId).UserId;
                var listPermissionUserCurrent = await GetGrandtedPemissionForUser(userId);
                var insert = input.Permissions?.Count > 0 ?
                             input.Permissions.FindAll(x => !listPermissionUserCurrent.Any(a => a == x)) : new List<string>();
                var remove = listPermissionUserCurrent?.Count > 0 ?
                             listPermissionUserCurrent.FindAll(x => !input.Permissions.Any(a => a == x)) : new List<string>();
                if (insert?.Count > 0)
                {
                    foreach (var i in insert)
                    {
                        await SetPermission(i, "U", userId.ToString());
                    }
                }

                if (remove?.Count > 0)
                {
                    foreach (var r in remove)
                    {
                        await DeletePermission(r, "U", userId.ToString());
                    }
                }

                await RefreshCacheUserPermission(userId.ToString());

                ret.IsSuccessful = true;
            }
            catch (Exception ex)
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra";
            }
            return ret;
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
        #endregion

        #region Permission Roles
        [HttpGet]
        public async Task<CommonResultDto<List<TreeNodePermissionNameDto>>> GetPermissionRole(long sysRoleId)
        {
            var ret = new CommonResultDto<List<TreeNodePermissionNameDto>>();
            try
            {
                var list = new List<TreeNodePermissionNameDto>();
                var sysRole = _factory.Repository<SysRoleEntity, long>().FirstOrDefault(x => x.Id == sysRoleId);
                var listPermissionForRole = await GetGrandtedPemissionForRole(new List<string> { sysRole.Ma });

                foreach (var group in _permissionDefinitionManager.GetGroups())
                {
                    var treeNode = new TreeNodePermissionNameDto();
                    treeNode.Title = group.Name;
                    treeNode.ListTreePermission = new List<TreePermissionDto>();
                    GetTreePermissionForRole(treeNode, group, listPermissionForRole);
                    list.Add(treeNode);
                }

                if (list?.Count > 0)
                {
                    foreach (var item in list)
                    {
                        if (item.ListTreePermission?.Count > 0)
                        {
                            foreach (var p in item.ListTreePermission)
                            {
                                SetIsHalfCheckedTreePermission(p);
                            }
                        }
                    }
                }

                ret.IsSuccessful = true;
                ret.DataResult = list;
            }
            catch (Exception ex)
            {

                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau!";
            }
            return ret;
        }

        private void GetTreePermissionForRole(
            TreeNodePermissionNameDto ret,
            PermissionGroupDefinition permissionGroup,
            List<string> listPermissionForRole
            )
        {
            if (permissionGroup?.Permissions?.Count > 0)
            {

                foreach (var permission in permissionGroup?.Permissions)
                {
                    var child = new TreePermissionDto();
                    child.Children = new List<TreePermissionDto>();

                    if (permission.Children?.Count > 0)
                    {
                        if (permission.Children?.Count > 0)
                        {
                            GetChildPermissionForRole(child, new List<PermissionDefinition>(permission.Children), listPermissionForRole);
                        }
                    }

                    child.Title = permission.Name;
                    child.Key = permission.Name;
                    child.IsLeaf = permission.Children?.Count <= 0;
                    child.Checked = listPermissionForRole.Contains(permission.Name);
                    child.Expanded = true;
                    child.DisableCheckbox = false;
                    ret.ListTreePermission.Add(child);
                }
            }
        }

        public void GetChildPermissionForRole(
           TreePermissionDto ret,
           List<PermissionDefinition> lisPermission,
           List<string> listPermissionForRole
           )
        {
            foreach (var permission in lisPermission)
            {
                var child = new TreePermissionDto();
                child.Children = new List<TreePermissionDto>();
                if (permission.Children?.Count > 0)
                {
                    foreach (var permissionChild in permission.Children)
                    {
                        var childNext = new TreePermissionDto();
                        childNext.Children = new List<TreePermissionDto>();
                        if (permissionChild.Children?.Count > 0)
                        {
                            GetChildPermissionForRole(childNext, new List<PermissionDefinition>(permissionChild.Children),listPermissionForRole);
                        }

                        childNext.Title = permissionChild.Name;
                        childNext.Key = permissionChild.Name;
                        childNext.IsLeaf = permissionChild.Children?.Count <= 0;
                        childNext.Checked = listPermissionForRole.Contains(permissionChild.Name);
                        childNext.Expanded = true;
                        childNext.DisableCheckbox = false;
                        child.Children.Add(childNext);
                    }
                }

                child.Title = permission.Name;
                child.Expanded = true;
                child.Key = permission.Name;
                child.IsLeaf = permission.Children?.Count <= 0;
                child.Checked = listPermissionForRole.Contains(permission.Name);
                child.DisableCheckbox = false;
                ret.Children.Add(child);
            }
        }

        [HttpPut]
        public async Task<CommonResultDto<bool>> UpdatePermissionRole(UpdatePermissionRoleDto input)
        {
            var ret = new CommonResultDto<bool>();
            try
            {
                var sysRole = _factory.Repository<SysRoleEntity, long>().FirstOrDefault(x => x.Id == input.SysRoleId);
                var listPermissionRoleCurrent = await GetGrandtedPemissionForRole(new List<string> { sysRole.Ma });
                var insert = input.Permissions?.Count > 0 ?
                             input.Permissions.FindAll(x => !listPermissionRoleCurrent.Any(a => a == x)) : new List<string>();
                var remove = listPermissionRoleCurrent?.Count > 0 ?
                             listPermissionRoleCurrent.FindAll(x => !input.Permissions.Any(a => a == x)) : new List<string>();
                if (insert?.Count > 0)
                {
                    foreach (var i in insert)
                    {
                        await SetPermission(i, "R", sysRole.Ma);
                    }
                }

                if (remove?.Count > 0)
                {
                    foreach (var r in remove)
                    {
                        await DeletePermission(r, "R", sysRole.Ma);
                    }
                }

                await RefreshCacheRolePermission(sysRole.Ma);

                ret.IsSuccessful = true;
            }
            catch (Exception ex)
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra";
            }
            return ret;
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

        #endregion

        #region helper
        private void SetIsHalfCheckedTreePermission(TreePermissionDto input)
        {
            if (input.Children?.Count > 0)
            {
                if (input.Children.All(x => x.Checked == true))
                {
                    input.Checked = true;
                }
                else if (input.Children.Any(x => x.Checked == true) && input.DisableCheckbox == false)
                {
                    input.IsHalfChecked = true;
                    input.Checked = false;
                }

                foreach (var item in input.Children)
                {
                    SetIsHalfCheckedTreePermission(item);
                }
            }
        }

        private async Task<List<string>> GetGrandtedPemissionForRole(List<string> maSysRole)
        {
            var query = $@" Select Name from AbpPermissionGrants Where ProviderKey IN ({string.Join(",", maSysRole.Select(x => $"'{x}'").ToArray())}) and ProviderName = 'R'";
            var reponse = await _factory.DefaultDbFactory.Connection.QueryAsync<string>(query.ToString());
            return reponse.ToList();
        }

        private async Task<CommonResultDto<bool>> DeletePermission(string permissionName, string providerName, string providerKey)
        {
            var ret = new CommonResultDto<bool>();
            try
            {
                var prms = new
                {
                    PermissionName = permissionName,
                    ProviderName = providerName,
                    ProviderKey = providerKey,
                };

                await _factory.DefaultDbFactory.Connection.ExecuteAsync(
                        $@"DELETE FROM AbpPermissionGrants
                       WHERE (Name, ProviderName, ProviderKey)
                        IN(
                        (@PermissionName, @ProviderName, @ProviderKey))"
                        , prms);

                ret.IsSuccessful = true;
            }
            catch
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra";
            }
            return ret;
        }

        private async Task<CommonResultDto<bool>> SetPermission(string permissionName, string providerName, string providerKey)
        {
            var ret = new CommonResultDto<bool>();
            try
            {
                var prms = new
                {
                    Id = _guidGenerator.Create(),
                    PermissionName = permissionName,
                    ProviderKey = providerKey,
                    ProviderName = providerName
                };

                await _factory.DefaultDbFactory.Connection.ExecuteAsync(
                        $@"INSERT INTO AbpPermissionGrants
                        (Id, TenantId, Name, ProviderName, ProviderKey)
                        VALUES
                        (@Id, NULL, @PermissionName, @ProviderName, @ProviderKey)"
                        , prms);
                ret.IsSuccessful = true;
            }
            catch
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra";
            }
            return ret;
        }
        #endregion
    }
}
