using Volo.Abp.Application;
using Volo.Abp.Modularity;
using Volo.Abp.TextTemplateManagement;
using Volo.Abp.TextTemplateManagement.EntityFrameworkCore;

namespace newPMS
{
    [DependsOn(
      typeof(AbpDddApplicationModule),
          typeof(TextTemplateManagementEntityFrameworkCoreModule),
          typeof(TextTemplateManagementDomainModule),
        typeof(TextTemplateManagementDomainSharedModule),
         typeof(TextTemplateManagementApplicationContractsModule),
         typeof(TextTemplateManagementApplicationModule)
       
       )]
    public class TextTemplateManagementModule : AbpModule
    {

    }
}
