using MediatR;
using Microsoft.AspNetCore.Mvc;
using newPMS.Account.Dtos;
using newPMS.Account.Queries;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Ord.Account.Queries;
using ApplicationService = Volo.Abp.Application.Services.ApplicationService;

namespace newPMS.Account
{
    public class AccountAppService: ApplicationService
    {
        private readonly IMediator _mediator;

        public AccountAppService(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Consumes("application/x-www-form-urlencoded")]
        public async Task<LoginResultDto> Login([FromForm] AccountLoginQuery model)
        {
            return await _mediator.Send(model);
        }

        [Consumes("application/x-www-form-urlencoded")]
        public async Task<LoginResultDto> Register([FromForm] AccountLoginQuery model)
        {
            return await _mediator.Send(model);
        }


        [Consumes("application/x-www-form-urlencoded")]
        public async Task<AuthJwtDto> RefreshToken([FromForm] AccountRefreshTokenQuery model)
        {
            return await _mediator.Send(model);
        }
        [Authorize]
        public async Task<AuthJwtDto> PasswordlessLogin(AccountPasswordlessLoginQuery input)
        {
            return await _mediator.Send(input);
        }
    }
}
