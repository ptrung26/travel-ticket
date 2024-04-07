using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using newPMS;
using newPMS.EntityFrameworkCore;
using newPMS.MultiTenancy;
using Ord.Niis;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;

namespace VIDD.DanhMuc
{
    [DependsOn(
        typeof(EmptyApplicationModule),
         typeof(OrdBaseHttpApiHostModule),
        typeof(BaseEntityFrameworkCoreModule)
        )]
    public class DanhMucHttpApiHostModule : AbpModule
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
            Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(EmptyApplicationModule).Assembly, opts =>
                {
                    opts.RootPath = configuration["Service:BaseUrl"];
                    opts.RemoteServiceName = configuration["Service:Name"];
                });
            });
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();

            if (MultiTenancyConsts.IsEnabled)
            {
                app.UseMultiTenancy();
            }


        }
    }
}
