using newPMS.Localization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace newPMS.Web.Pages
{
    public abstract class newPMSPageModel : AbpPageModel
    {
        protected newPMSPageModel()
        {
            LocalizationResourceType = typeof(newPMSResource);
        }
    }
}