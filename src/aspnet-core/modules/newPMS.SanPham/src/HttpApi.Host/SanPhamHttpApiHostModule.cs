using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using newPMS;
using newPMS.EntityFrameworkCore;
using newPMS.MultiTenancy;
using Ord.Niis;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.BackgroundJobs;

namespace TravelTicket.SanPham
{
    [DependsOn(
        typeof(SanPhamApplicationModule),
         typeof(OrdBaseHttpApiModule),
        typeof(BaseEntityFrameworkCoreModule)
        )]
    public class SanPhamHttpApiHostModule : AbpModule
    {
        private const string DefaultCorsPolicyName = "Default";

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var hostingEnvironment = context.Services.GetHostingEnvironment();
            var configuration = context.Services.GetConfiguration();
            Configure<AbpMultiTenancyOptions>(options =>
            {
                options.IsEnabled = MultiTenancyTravelTicketConsts.IsEnabled;
            });
            Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(SanPhamApplicationModule).Assembly, opts =>
                {
                    opts.RootPath = configuration["Service:BaseUrl"];
                    opts.RemoteServiceName = configuration["Service:Name"];
                });
            });
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();

            if (MultiTenancyTravelTicketConsts.IsEnabled)
            {
                app.UseMultiTenancy();
            }


        }
    }
}
