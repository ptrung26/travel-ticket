using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using newPMS;
using newPMS.EntityFrameworkCore;
using newPMS.MultiTenancy;
using Ord.Niis;
using OrdBaseApplication.Helper;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;

namespace YTCS.TiemChung
{
    [DependsOn(
        typeof(EmptyApplicationModule),
         typeof(OrdBaseHttpApiHostModule),
        typeof(BaseEntityFrameworkCoreModule)
        )]
    public class newPMSHttpApiHostModule : AbpModule
    {
        private const string DefaultCorsPolicyName = "Default";

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var hostingEnvironment = context.Services.GetHostingEnvironment();
            var configuration = context.Services.GetConfiguration();
            Configure<AbpMultiTenancyOptions>(options =>
            {
                options.IsEnabled = MultiTenancyConsts.IsEnabled;
            });
            //if (hostingEnvironment.IsDevelopment())
            //{
            //    Configure<AbpVirtualFileSystemOptions>(options =>
            //    {
            //        options.FileSets.ReplaceEmbeddedByPhysical<TiemChungApplicationModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}YTCS.TiemChung.Application", Path.DirectorySeparatorChar)));
            //    });
            //}
            Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(EmptyApplicationModule).Assembly, opts =>
                {
                    opts.RootPath = configuration["Service:BaseUrl"];
                    opts.RemoteServiceName = configuration["Service:Name"];
                });
            });
            BuildAppSettingsProvider(configuration);
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();

            if (MultiTenancyConsts.IsEnabled)
            {
                app.UseMultiTenancy();
            }

            SeedData(context);
        }

        private void SeedData(ApplicationInitializationContext context)
        {
            //AsyncHelper.RunSync(async () =>
            //{
            //    using (var scope = context.ServiceProvider.CreateScope())
            //    {
            //        await scope.ServiceProvider
            //            .GetRequiredService<IDataSeeder>()
            //            .SeedAsync();
            //    }
            //});
        }
        private void BuildAppSettingsProvider(IConfiguration configuration)
        {
            AppSettingsProvider.ServiceBaseUrl = configuration["Service:BaseUrl"];
        }
    }
}
