using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Newtonsoft.Json;
using Volo.Abp.Account.Public.Web.Pages.Account;

namespace newPMS.Web.Pages.Account
{
    public class ForgotPasswordModel : Volo.Abp.Account.Public.Web.Pages.Account.ForgotPasswordModel
    {
        private readonly IConfiguration _config;
        
        public ForgotPasswordModel(IConfiguration config)
        {
            _config = config;
        }

        public override Task<IActionResult> OnGetAsync()
        {
            return base.OnGetAsync();
        }
        public override async Task<IActionResult> OnPostAsync()
        {
            var res =await base.OnPostAsync();
            return res;
        }
       
    }
}
