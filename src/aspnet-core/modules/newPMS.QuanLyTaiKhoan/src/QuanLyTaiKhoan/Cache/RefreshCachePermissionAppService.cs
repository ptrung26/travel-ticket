using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Caching;
using Volo.Abp.PermissionManagement;

namespace newPMS
{
    public class RefreshCachePermissionAppService : ApplicationService
    {
        private readonly IDistributedCache<PermissionGrant> _permissionGrantCache;

        public RefreshCachePermissionAppService(IDistributedCache<PermissionGrant> permissionGrantCache)
        {
            _permissionGrantCache = permissionGrantCache;
        }

        public async Task RefreshForRole(RefreshPermissionForRoleDto input)
        {
            if (input?.ListOfKeyCache?.Any() == true)
            {
                foreach (var keyCache in input.ListOfKeyCache)
                {
                    try
                    {
                        await _permissionGrantCache.RemoveAsync(keyCache);
                    }
                    catch
                    {
                        // ignored
                    }
                }
            }
        }
        public async Task RefreshForUser(RefreshPermissionForUserDto input)
        {
            if (input?.ListOfKeyCache?.Any() == true)
            {
                foreach (var keyCache in input.ListOfKeyCache)
                {
                    try
                    {
                        await _permissionGrantCache.RemoveAsync(keyCache);
                    }
                    catch
                    {
                        // ignored
                    }
                }
            }
        }
    }

    public class RefreshPermissionForRoleDto
    {
        public string RoleName { get; set; }
        public List<string> ListOfPermissions { get; set; }

        public List<string> ListOfKeyCache
        {
            get
            {
                return ListOfPermissions?.Select(per=> $"pn:R,pk:{RoleName},n:{per}")?.ToList();
            }
        }
    }

    public class RefreshPermissionForUserDto
    {
        public string UserName { get; set; }
        public List<string> ListOfPermissions { get; set; }

        public List<string> ListOfKeyCache
        {
            get
            {
                return ListOfPermissions?.Select(per => $"pn:U,pk:{UserName},n:{per}")?.ToList();
            }
        }
    }
}
