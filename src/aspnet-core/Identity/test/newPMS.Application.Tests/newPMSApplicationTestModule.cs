using Volo.Abp.Modularity;

namespace newPMS
{
    [DependsOn(
        typeof(newPMSApplicationModule),
        typeof(newPMSDomainTestModule)
        )]
    public class newPMSApplicationTestModule : AbpModule
    {

    }
}