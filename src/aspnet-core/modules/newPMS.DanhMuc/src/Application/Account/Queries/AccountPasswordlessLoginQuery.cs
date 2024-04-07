using MediatR;
using newPMS.Account.Dtos;
using Ord.Account.Commands;
using OrdBaseApplication.Factory;
using System;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Identity;

namespace Ord.Account.Queries
{
    public class AccountPasswordlessLoginQuery: IRequest<AuthJwtDto>
    {
        public Guid UserId { get; set; }

        private class Handler : IRequestHandler<AccountPasswordlessLoginQuery, AuthJwtDto>
        {
            private readonly IOrdAppFactory _factory;
            private readonly IdentityUserManager _userManager;
            public Handler(IOrdAppFactory factory, IdentityUserManager userManager)
            {
                _factory = factory;
                _userManager = userManager;
            }

            public async Task<AuthJwtDto> Handle(AccountPasswordlessLoginQuery request, CancellationToken cancellationToken)
            {
                var user = await _userManager.GetByIdAsync(request.UserId);
                if (user == null)
                {
                    throw new UserFriendlyException("not_found_user", "error_login");
                }
                return await _factory.Mediator.Send(new AccountCreateJwtCommand()
                {
                    User = user,
                    Roles = await _userManager.GetRolesAsync(user)
                }, cancellationToken);
            }
        }
    }
}
