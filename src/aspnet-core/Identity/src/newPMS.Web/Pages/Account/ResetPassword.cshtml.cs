using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Volo.Abp.MultiTenancy;

namespace newPMS.Web.Pages.Account
{
    public class ResetPasswordModel : Volo.Abp.Account.Public.Web.Pages.Account.ResetPasswordModel
    {
        public ResetPasswordModel(ITenantResolveResultAccessor tenantResolveResultAccessor) : base(tenantResolveResultAccessor)
        {
        }
        public override Task<IActionResult> OnPostAsync()
        {

            return base.OnPostAsync();
        }

    }
}
