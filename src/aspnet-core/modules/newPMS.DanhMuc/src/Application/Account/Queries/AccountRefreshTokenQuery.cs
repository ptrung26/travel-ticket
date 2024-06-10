using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Ord.Account.Commands;
using System;
using System.Threading;
using System.Threading.Tasks;
using newPMS.Account.Dtos;
using OrdBaseApplication.Factory;
using Volo.Abp;
using Volo.Abp.Caching;
using Volo.Abp.Identity;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace Ord.Account.Queries
{
    public class AccountRefreshTokenQuery : IRequest<AuthJwtDto>
    {
        public string access_token { get; set; }
        public string refresh_token { get; set; }
    }
    public class AccountRefreshTokenQueryHandler : IRequestHandler<AccountRefreshTokenQuery, AuthJwtDto>
    {
        private readonly IDistributedCache<AuthJwtDto> _jwtRefeshCache;
        private readonly IOrdAppFactory _factory;
        private IDistributedCache<string> RefreshTokenCache =>
            _factory.GetServiceDependency<IDistributedCache<string>>();
        private readonly IdentityUserManager _userManager;
        public AccountRefreshTokenQueryHandler(IDistributedCache<AuthJwtDto> jwtRefeshCache, IOrdAppFactory factory, IdentityUserManager userManager)
        {
            _jwtRefeshCache = jwtRefeshCache;
            _factory = factory;
            _userManager = userManager;
        }

        public async Task<AuthJwtDto> Handle(AccountRefreshTokenQuery request, CancellationToken cancellationToken)
        {
            var refreshTokenKeyCache = $@"{request.refresh_token}{request.access_token}";
            var cacheRefeshResult = await _jwtRefeshCache.GetAsync(refreshTokenKeyCache);
            if (cacheRefeshResult != null)
            {
                return cacheRefeshResult;
            }
            var userId = await RefreshTokenCache.GetAsync(refreshTokenKeyCache);
            await RefreshTokenCache.RemoveAsync(refreshTokenKeyCache);
            if (string.IsNullOrEmpty(userId))
            {
                throw new UserFriendlyException("not_found_user", "error_login");
            }

            var user = await _userManager.GetByIdAsync(new Guid(userId));
            if (user == null)
            {
                throw new UserFriendlyException("not_found_user", "error_login");
            }
            if (user.LockoutEnabled && user.LockoutEnd.HasValue && DateTimeOffset.Compare(user.LockoutEnd.Value, DateTimeOffset.Now) > 0)
            {
                throw new UserFriendlyException("user_locked", "error_login");
            }

            var result = await _factory.Mediator.Send(new AccountCreateJwtCommand()
            {
                User = user,
                Roles = await _userManager.GetRolesAsync(user)
            }, cancellationToken);

            await _jwtRefeshCache.SetAsync(refreshTokenKeyCache, result, new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
            });
            return result;
        }
    }
}
