using Volo.Abp.Application;
using Volo.Abp.Authorization;
using Volo.Abp.Modularity;

namespace newPMS
{
    [DependsOn(
        typeof(BaseDomainSharedModule),
        typeof(AbpDddApplicationContractsModule),
        typeof(AbpAuthorizationModule)
    )]
    public class BaseApplicationContractsModule : AbpModule
    {
    }
}