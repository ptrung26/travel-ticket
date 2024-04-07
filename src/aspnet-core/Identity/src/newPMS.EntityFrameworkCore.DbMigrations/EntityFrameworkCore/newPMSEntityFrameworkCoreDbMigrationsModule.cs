using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Modularity;

namespace newPMS.EntityFrameworkCore
{
    [DependsOn(
        typeof(newPMSEntityFrameworkCoreModule)
    )]
    public class newPMSEntityFrameworkCoreDbMigrationsModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<newPMSMigrationsDbContext>();
        }
    }
}