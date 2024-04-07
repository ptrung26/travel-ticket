using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace newPMS.Web.Pages
{
    public class IndexModel : newPMSPageModel
    {

        public IndexModel()
        {
        }

        public ActionResult OnGet()
        {
            if (!CurrentUser.IsAuthenticated)
            {
                return Redirect("~/Account/Login");
            }
            return Page();
        }

    }
}