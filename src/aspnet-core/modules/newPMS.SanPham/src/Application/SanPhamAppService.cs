using Volo.Abp.Application.Services;
using newPMS.Localization;

namespace newPMS
{
    public abstract class SanPhamAppService : ApplicationService
    {
        protected SanPhamAppService()
        {
            LocalizationResource = typeof(BaseResource);
            ObjectMapperContext = typeof(SanPhamApplicationModule);
        }
    }
}
