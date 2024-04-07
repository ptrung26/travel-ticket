
using Abp.UI;
using MediatR;
using newPMS.Account.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using Ord.Account.Commands;
using Volo.Abp.Auditing;
using Volo.Abp.Identity;

namespace newPMS.Account.Queries
{
    public class AccountLoginQuery : IRequest<LoginResultDto>
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [DisableAuditing]
        public string Password { get; set; }

    }
    public class AccountLoginQueryHandler : IRequestHandler<AccountLoginQuery, LoginResultDto>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IdentityUserManager _userManager;

        public AccountLoginQueryHandler(IOrdAppFactory factory, IdentityUserManager userManager)
        {
            _factory = factory;
            _userManager = userManager;
        }

        public async Task<LoginResultDto> Handle(AccountLoginQuery request, CancellationToken cancellationToken)
        {
            var result = new LoginResultDto();
            var user = await _userManager.FindByNameAsync(request.UserName);

            if (user == null)
            {
                result.IsSuccessful=false;
                result.ErrorMessage="Tài khoản không tồn tại!!";
                return result;
            }
            else
            {
                if (user.LockoutEnabled && user.LockoutEnd.HasValue && DateTimeOffset.Compare(user.LockoutEnd.Value, DateTimeOffset.Now) > 0)
                {
                    result.IsSuccessful=false;
                    result.ErrorMessage="Tài khoản đang bị khóa!!";
                    return result;
                }
                var checkPassword = await _userManager.CheckPasswordAsync(user, request.Password);
                if (!checkPassword)
                {
                    result.IsSuccessful=false;
                    result.ErrorMessage="Tên đăng nhập hoặc mật khẩu không đúng!!!";
                    return result;
                }
                else
                {
                    result.IsSuccessful=true;
                    result.authJwtDto= await _factory.Mediator.Send(new AccountCreateJwtCommand()
                    {
                        User = user,
                        Roles = await _userManager.GetRolesAsync(user)
                    }, cancellationToken);
                }
            }
            return result;
        }
    }
}
