using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Modularity;

namespace newPMS.EntityFrameworkCore
{
    [DependsOn(
        typeof(BaseEntityFrameworkCoreModule)
    )]
    public class BaseEntityFrameworkCoreDbMigrationsModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<BaseMigrationsDbContext>();
        }
    }
}