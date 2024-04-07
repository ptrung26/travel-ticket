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

namespace TravelTicket.CongViec
{
    [DependsOn(
       typeof(CongViecApplicationModule),
        typeof(SharedApplicationModule),
        typeof(OrdBaseHttpApiModule),
        typeof(BaseEntityFrameworkCoreModule)
        )]
    public class CongViecHttpApiHostModule : AbpModule
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
                options.ConventionalControllers.Create(typeof(CongViecApplicationModule).Assembly, opts =>
                {
                    opts.RootPath = "cong-viec";
                    opts.RemoteServiceName = "CongViec";
                });
            });
            context.ConfigureHangfire();
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();

            if (MultiTenancyTravelTicketConsts.IsEnabled)
            {
                app.UseMultiTenancy();
            }
            app.HangfireDashboard();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                  name: "Home",
                  pattern: "",
                  defaults: new { controller = "Home", action = "IndexCongViec" },
                  null,
                  dataTokens: new[] { "newPMS.CongViec.Controllers" }
                  );
            });

        }
    }
}
