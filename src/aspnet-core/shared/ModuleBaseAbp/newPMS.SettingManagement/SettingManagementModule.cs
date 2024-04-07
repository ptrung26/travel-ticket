using Volo.Abp.Emailing;
using Volo.Abp.Modularity;
using Volo.Abp.SettingManagement;
using Volo.Abp.SettingManagement.EntityFrameworkCore;

namespace newPMS
{
    [DependsOn(
          typeof(AbpSettingManagementEntityFrameworkCoreModule),
          typeof(AbpSettingManagementDomainSharedModule),
        typeof(AbpSettingManagementDomainModule),
           typeof(AbpEmailingModule),
         typeof(AbpSettingManagementApplicationContractsModule),
         typeof(AbpSettingManagementApplicationModule)
       )]
    public class SettingManagementModule : AbpModule
    {
    }
}
