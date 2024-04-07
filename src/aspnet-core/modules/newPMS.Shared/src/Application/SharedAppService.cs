using Volo.Abp.Application.Services;
using newPMS.Localization;

namespace newPMS
{
    public abstract class SharedAppService : ApplicationService
    {
        protected SharedAppService()
        {
            LocalizationResource = typeof(BaseResource);
            ObjectMapperContext = typeof(SharedApplicationModule);
        }
    }
}
