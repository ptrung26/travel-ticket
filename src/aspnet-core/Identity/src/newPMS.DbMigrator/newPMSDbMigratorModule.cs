using newPMS.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Modularity;

namespace newPMS.DbMigrator
{
    [DependsOn(
        typeof(AbpAutofacModule),
        typeof(newPMSEntityFrameworkCoreDbMigrationsModule),
        typeof(newPMSApplicationContractsModule)
    )]
    public class newPMSDbMigratorModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpBackgroundJobOptions>(options =>
            {
                options.IsJobExecutionEnabled = false;
            });
        }
    }
}