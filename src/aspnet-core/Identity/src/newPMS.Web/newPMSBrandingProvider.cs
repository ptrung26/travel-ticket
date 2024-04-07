using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;

namespace newPMS.Web
{
    [Dependency(ReplaceServices = true)]
    public class newPMSBrandingProvider : DefaultBrandingProvider
    {
        public override string AppName => "newPMS";
    }
}
