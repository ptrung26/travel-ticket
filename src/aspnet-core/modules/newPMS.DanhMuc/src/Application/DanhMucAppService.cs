using Volo.Abp.Application.Services;
using newPMS.Localization;

namespace newPMS
{
    public abstract class DanhMucAppService : ApplicationService
    {
        protected DanhMucAppService()
        {
            LocalizationResource = typeof(BaseResource);
            ObjectMapperContext = typeof(DanhMucApplicationModule);
        }
    }
}
