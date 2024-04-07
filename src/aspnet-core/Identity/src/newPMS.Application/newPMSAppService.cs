using newPMS.Localization;
using Volo.Abp.Application.Services;

namespace newPMS
{
    /* Inherit your application services from this class.
     */
    public abstract class newPMSAppService : ApplicationService
    {
        protected newPMSAppService()
        {
            LocalizationResource = typeof(newPMSResource);
        }
    }
}
