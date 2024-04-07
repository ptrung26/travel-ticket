using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using newPMS;
using newPMS.EntityFrameworkCore;
using newPMS.MultiTenancy;
using Ord.Niis;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Identity.AspNetCore;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.BackgroundJobs;
namespace TravelTicket.QuanLyTaiKhoan
{
    [DependsOn(
        typeof(QuanLyTaiKhoanApplicationModule),
         typeof(OrdBaseHttpApiModule),
        typeof(BaseEntityFrameworkCoreModule),
        typeof(AbpIdentityAspNetCoreModule),
        typeof(AbpBackgroundJobsModule)
        )]
    public class QuanLyTaiKhoanHttpApiHostModule : AbpModule
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
                options.ConventionalControllers.Create(typeof(QuanLyTaiKhoanApplicationModule).Assembly, opts =>
                {
                    opts.RootPath = "tai-khoan";
                    opts.RemoteServiceName = "TaiKhoan";
                });
            });
            Configure<IdentityBuilder>(builder =>
            {
                builder
                    .AddDefaultTokenProviders();
            });
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();

            if (MultiTenancyTravelTicketConsts.IsEnabled)
            {
                app.UseMultiTenancy();
            }

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "Home",
                    pattern: "",
                    defaults: new { controller = "Home", action = "IndexTaiKhoan" },
                    null,
                    dataTokens: new[] { "newPMS.TaiKhoan.Controllers" }
                    );
            });
        }
    }
}
