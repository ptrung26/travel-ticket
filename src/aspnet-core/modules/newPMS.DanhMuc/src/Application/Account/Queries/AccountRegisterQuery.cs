using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using newPMS.Account.Dtos;
using Ord.Account.Commands;
using Ord.Account.Queries;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Auditing;
using Volo.Abp.Caching;
using Volo.Abp.Identity;

namespace newPMS.Account.Queries
{
    public class AccountRegisterQuery : IRequest<LoginResultDto>
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [DisableAuditing]
        public string Password { get; set; }

    }
    public class AccountRegisterQueryHandler : IRequestHandler<AccountLoginQuery, LoginResultDto>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IdentityUserManager _userManager;

        public AccountRegisterQueryHandler(IOrdAppFactory factory, IdentityUserManager userManager)
        {
            _factory = factory;
            _userManager = userManager;
        }

        public async Task<LoginResultDto> Handle(AccountLoginQuery request, CancellationToken cancellationToken)
        {
            var result = new LoginResultDto();
            var user = await _userManager.FindByNameAsync(request.UserName);

            if (user != null)
            {
                result.IsSuccessful = false;
                result.ErrorMessage = "Tài khoản đã tồn tại";
                return result;
            }
            else
            {
                result.IsSuccessful = true;
                result.AuthJwtDto = await _factory.Mediator.Send(new AccountCreateJwtCommand()
                {
                    User = user,
                    Roles = await _userManager.GetRolesAsync(user)
                });
            }
            return result;
        }
    }
}

