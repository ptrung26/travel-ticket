using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Caching;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;
using Volo.Abp.SecurityLog;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace newPMS.UserSessionManagement
{
    [Authorize]
    public class UserExtensionAppService: ApplicationService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IDistributedCache<UserSessionDto> _cacheSession;
        protected ISecurityLogManager SecurityLogManager { get; }
        protected IdentityUserManager UserManager { get; }
        protected ICurrentPrincipalAccessor CurrentPrincipalAccessor { get; }
        protected IUserClaimsPrincipalFactory<IdentityUser> UserClaimsPrincipalFactory { get; }

        public UserExtensionAppService(IOrdAppFactory factory, IDistributedCache<UserSessionDto> cacheSession, ISecurityLogManager securityLogManager,
            IdentityUserManager userManager, ICurrentPrincipalAccessor currentPrincipalAccessor,
            IUserClaimsPrincipalFactory<IdentityUser> userClaimsPrincipalFactory)
        {
            _factory = factory;
            _cacheSession = cacheSession;
            SecurityLogManager = securityLogManager;
            UserManager = userManager;
            CurrentPrincipalAccessor = currentPrincipalAccessor;
            UserClaimsPrincipalFactory = userClaimsPrincipalFactory;
        }

        [AllowAnonymous]
        public async Task<UserSessionDto> GetUserSession()
        {
            try
            {
                var session = _factory.UserSession;
                return session;

            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau"); 
            }
        }
        public void ClearUserSessionCache()
        {
            _factory.ClearUserSessionCache();
        }

        private async Task<bool> DaCauHinhThamSoHeThong(long donViCoSoId)
        {
            return true;
            //var sql = $@"SELECT Id from SysAppSettings  WHERE DonViCoSoId  = {donViCoSoId} and IsDeleted  = 0 ";
            //var id = await _factory.YTeCoSoDbFactory.Connection.QueryFirstOrDefaultAsync<long>(sql);
            //return id > 0;
        }
    }
}
