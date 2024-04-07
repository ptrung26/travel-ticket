using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.ApplicationConfigurations;
using Volo.Abp.AspNetCore.Mvc.MultiTenancy;
using Volo.Abp.Authorization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Users;

namespace newPMS.DanhMuc.Controllers
{

    public class OrdApplicationConfiguration : AbpController
    {
        private readonly ICurrentUser _currentUser;

        public OrdApplicationConfiguration(ICurrentUser currentUser)
        {
            _currentUser = currentUser;
        }

        [HttpGet("/api/danh-muc/ord-application-configuration/get-configuration")]
        public async Task<ApplicationConfigurationDto> GetConfigurationAsync()
        {
            try
            {
                if (_currentUser != null && _currentUser.Id.HasValue)
                {
                    var ret = new ApplicationConfigurationDto()
                    {
                        Auth = await GetAuthConfigAsync(),
                        CurrentUser = GetCurrentUser(),
                        CurrentTenant = GetCurrentTenant(),
                    };
                    return ret;
                }
                return null;
            }
            catch(Exception ex)
            {
                return null;
            }
        }
        protected virtual CurrentUserDto GetCurrentUser()
        {
            return new CurrentUserDto
            {

                IsAuthenticated = _currentUser.IsAuthenticated,
                Id = _currentUser.Id,
                TenantId = _currentUser.TenantId,
                UserName = _currentUser.UserName,
                SurName = _currentUser.SurName,
                Name = _currentUser.Name,
                Email = _currentUser.Email,
                EmailVerified = _currentUser.EmailVerified,
                PhoneNumber = _currentUser.PhoneNumber,
                PhoneNumberVerified = _currentUser.PhoneNumberVerified,
                Roles = _currentUser.Roles
            };
        }
        protected virtual CurrentTenantDto GetCurrentTenant()
        {
            return new CurrentTenantDto()
            {
                Id = CurrentTenant.Id,
                Name = CurrentTenant.Name,
                IsAvailable = CurrentTenant.IsAvailable
            };
        }
        protected virtual async Task<ApplicationAuthConfigurationDto> GetAuthConfigAsync()
        {
            #region get LazyGetRequiredService

            IAbpAuthorizationPolicyProvider _abpAuthorizationPolicyProvider =
                LazyServiceProvider.LazyGetRequiredService<IAbpAuthorizationPolicyProvider>();
            DefaultAuthorizationPolicyProvider _defaultAuthorizationPolicyProvider =
                LazyServiceProvider.LazyGetRequiredService<DefaultAuthorizationPolicyProvider>();
            IPermissionDefinitionManager _permissionDefinitionManager =
                LazyServiceProvider.LazyGetRequiredService<IPermissionDefinitionManager>();
            IAuthorizationService _authorizationService =
                LazyServiceProvider.LazyGetRequiredService<IAuthorizationService>();
            IPermissionChecker _permissionChecker =
                LazyServiceProvider.LazyGetRequiredService<IPermissionChecker>();

            #endregion

            var authConfig = new ApplicationAuthConfigurationDto();

            var policyNames = await _abpAuthorizationPolicyProvider.GetPoliciesNamesAsync();
            var abpPolicyNames = new List<string>();
            var otherPolicyNames = new List<string>();

            foreach (var policyName in policyNames)
            {
                if (await _defaultAuthorizationPolicyProvider.GetPolicyAsync(policyName) == null && _permissionDefinitionManager.GetOrNull(policyName) != null)
                {
                    abpPolicyNames.Add(policyName);
                }
                else
                {
                    otherPolicyNames.Add(policyName);
                }
            }

            foreach (var policyName in otherPolicyNames)
            {
                authConfig.Policies[policyName] = true;

                if (await _authorizationService.IsGrantedAsync(policyName))
                {
                    authConfig.GrantedPolicies[policyName] = true;
                }
            }

            var result = await _permissionChecker.IsGrantedAsync(abpPolicyNames.ToArray());
            foreach (var (key, value) in result.Result)
            {
                authConfig.Policies[key] = true;
                if (value == PermissionGrantResult.Granted)
                {
                    authConfig.GrantedPolicies[key] = true;
                }
            }

            return authConfig;
        }

    }
}
