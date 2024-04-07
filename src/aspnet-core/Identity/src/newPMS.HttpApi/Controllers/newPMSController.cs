using newPMS.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace newPMS.Controllers
{
    /* Inherit your controllers from this class.
     */
    public abstract class newPMSController : AbpController
    {
        protected newPMSController()
        {
            LocalizationResource = typeof(newPMSResource);
        }
    }
}