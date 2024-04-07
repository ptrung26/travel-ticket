using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.Dapper;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.MySQL;
using Volo.Abp.Modularity;

namespace newPMS.EntityFrameworkCore
{
    [DependsOn(
        typeof(BaseDomainModule),
        typeof(AbpEntityFrameworkCoreMySQLModule),
         typeof(BlobStoringDatabaseEntityFrameworkCoreModule),
         typeof(AbpDapperModule)
        )]
    public class BaseEntityFrameworkCoreModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            BaseEfCoreEntityExtensionMappings.Configure();
        }

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<BaseDbContext>(options =>
            {
                /* Remove "includeAllEntities: true" to create
                 * default repositories only for aggregate roots */
                options.AddDefaultRepositories(includeAllEntities: true);
            });

            Configure<AbpDbContextOptions>(options =>
            {
                /* The main point to change your DBMS.
                 * See also newPMSMigrationsDbContextFactory for EF Core tooling. */
                options.UseMySQL();
            });
        }
    }
}
