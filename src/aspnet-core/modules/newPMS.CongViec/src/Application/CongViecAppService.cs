using Volo.Abp.Application.Services;
using newPMS.Localization;

namespace newPMS
{
    public abstract class CongViecAppService : ApplicationService
    {
        protected CongViecAppService()
        {
            LocalizationResource = typeof(BaseResource);
            ObjectMapperContext = typeof(CongViecApplicationModule);
        }
    }
}
