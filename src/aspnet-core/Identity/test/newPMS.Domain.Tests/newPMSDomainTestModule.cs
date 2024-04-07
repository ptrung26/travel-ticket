using newPMS.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace newPMS
{
    [DependsOn(
        typeof(newPMSEntityFrameworkCoreTestModule)
        )]
    public class newPMSDomainTestModule : AbpModule
    {

    }
}