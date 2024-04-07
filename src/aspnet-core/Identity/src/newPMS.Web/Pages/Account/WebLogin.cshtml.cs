
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Owl.reCAPTCHA;
using System.Threading.Tasks;
using Volo.Abp.Account.ExternalProviders;
using Volo.Abp.Account.Public.Web;
using Volo.Abp.Account.Public.Web.Pages.Account;
using Volo.Abp.Account.Security.Recaptcha;
using Volo.Abp.Security.Claims;

namespace newPMS.Web.Pages.Account
{
    public class WebLoginModel : LoginModel
    {
        public WebLoginModel(IAuthenticationSchemeProvider schemeProvider, IOptions<AbpAccountOptions> accountOptions,
           IAbpRecaptchaValidatorFactory recaptchaValidatorFactory,
           IAccountExternalProviderAppService accountExternalProviderAppService,
           ICurrentPrincipalAccessor currentPrincipalAccessor,
           IOptions<IdentityOptions> identityOptions,
           IOptionsSnapshot<reCAPTCHAOptions> reCaptchaOptions) :
           base(schemeProvider, accountOptions, recaptchaValidatorFactory, accountExternalProviderAppService, currentPrincipalAccessor, identityOptions, reCaptchaOptions)
        {
        }

        public override Task<IActionResult> OnPostAsync(string action)
        {
            return base.OnPostAsync(action);
        }
    }
}