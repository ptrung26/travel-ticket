using Abp;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using newPMS.Account.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Volo.Abp.Caching;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;

namespace Ord.Account.Commands
{
    public class AccountCreateJwtCommand : IRequest<AuthJwtDto>
    {
        public IdentityUser User { get; set; }
        public IList<string> Roles { get; set; }
    }
    public class AccountCreateJwtCommandHandler : IRequestHandler<AccountCreateJwtCommand, AuthJwtDto>
    {
        private readonly IOrdAppFactory _factory;
        private IDistributedCache<string> RefreshTokenCache => _factory.GetServiceDependency<IDistributedCache<string>>();
        public AccountCreateJwtCommandHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<AuthJwtDto> Handle(AccountCreateJwtCommand request, CancellationToken cancellationToken)
        {
            var user = request.User;
            var issuer = _factory.AppSettingConfiguration["AuthServer:Authority"].TrimEnd('/');
            var key = issuer + "TravelTicket-2e7a1e80-16ee-4e52-b5c6-5e8892453459";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var permClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(AbpClaimTypes.UserId, user.Id.ToString())
            };

            if (!string.IsNullOrEmpty(user.Email))
            {
                permClaims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
            }

            if (!string.IsNullOrEmpty(user.UserName))
            {
                permClaims.Add(new Claim(AbpClaimTypes.UserName, user.UserName));
            }

            if (!string.IsNullOrEmpty(user.Name))
            {
                permClaims.Add(new Claim(AbpClaimTypes.Name, user.Name));
            }

            if (user.TenantId != null)
            {
                permClaims.Add(new Claim(AbpClaimTypes.TenantId, user.TenantId.ToString()));
            }
            if (request.Roles?.Any() == true)
            {
                foreach (var roleName in request.Roles)
                {
                    permClaims.Add(new Claim("role", roleName));
                }
            }

            var accessTokenLifetime = 360;
            var refreshTokenExpiration = 720;
            var token = new JwtSecurityToken(issuer,
                issuer,
                permClaims,
                expires: DateTime.UtcNow.AddMinutes(accessTokenLifetime),
                signingCredentials: credentials);

            var result = new AuthJwtDto()
            {
                access_token = new JwtSecurityTokenHandler().WriteToken(token),
                refresh_token = GenerateRefreshToken(),
                token_type = "Bearer"
            };


           await  RefreshTokenCache.SetAsync($@"{result.refresh_token}{result.access_token}",
                user.Id.ToString(),
                new DistributedCacheEntryOptions()
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(refreshTokenExpiration)
                });
            return result;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[16];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

    }
}
