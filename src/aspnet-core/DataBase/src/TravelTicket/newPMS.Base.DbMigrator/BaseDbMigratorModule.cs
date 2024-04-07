using newPMS.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Modularity;

namespace newPMS.DbMigrator
{
    [DependsOn(
        typeof(AbpAutofacModule),
        typeof(BaseEntityFrameworkCoreDbMigrationsModule),
        typeof(BaseApplicationContractsModule)
    )]
    public class BaseDbMigratorModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            //Configure<AbpBackgroundJobOptions>(options =>
            //{
            //    options.IsJobExecutionEnabled = false;
            //});
        }
    }
}