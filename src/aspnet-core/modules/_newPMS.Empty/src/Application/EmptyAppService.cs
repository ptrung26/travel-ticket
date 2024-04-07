using Volo.Abp.Application.Services;
using newPMS.Localization;

namespace newPMS
{
    public abstract class EmptyAppService : ApplicationService
    {
        protected EmptyAppService()
        {
            LocalizationResource = typeof(BaseResource);
            ObjectMapperContext = typeof(EmptyApplicationModule);
        }
    }
}
