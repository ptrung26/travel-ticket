using Volo.Abp.Application.Services;
using newPMS.Localization;

namespace newPMS
{
    public abstract class QuanLyTaiKhoanAppService : ApplicationService
    {
        protected QuanLyTaiKhoanAppService()
        {
            LocalizationResource = typeof(BaseResource);
            ObjectMapperContext = typeof(QuanLyTaiKhoanApplicationModule);
        }
    }
}
