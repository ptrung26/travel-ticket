using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using newPMS;
using newPMS.EntityFrameworkCore;
using newPMS.MultiTenancy;
using Ord.Niis;
using System.IO;
using Volo.Abp;
using Volo.Abp.Account;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AuditLogging;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.IdentityServer;
using Volo.Abp.LanguageManagement;
using Volo.Abp.LeptonTheme.Management;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TextTemplateManagement;
using Volo.Saas.Host;
namespace TravelTicket.DanhMuc
{
    [DependsOn(
        typeof(DanhMucApplicationModule),
         typeof(OrdBaseHttpApiModule),
        typeof(BaseEntityFrameworkCoreModule),
        typeof(AbpIdentityEntityFrameworkCoreModule)
        )]
    [DependsOn(
        typeof(AbpFeatureManagementApplicationContractsModule),
        typeof(AbpPermissionManagementApplicationContractsModule),
        typeof(AbpSettingManagementApplicationContractsModule),
        typeof(SaasHostApplicationContractsModule),
        typeof(AbpAuditLoggingApplicationContractsModule),
        typeof(AbpIdentityServerApplicationContractsModule),
        typeof(AbpAccountPublicApplicationContractsModule),
        typeof(AbpAccountAdminApplicationContractsModule),

        // role base TravelTicket
        typeof(BaseApplicationContractsModule)
    //typeof(PortalApplicationContractsModule),
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
                options.IsEnabled = MultiTenancyTravelTicketConsts.IsEnabled;
            });
            Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(DanhMucApplicationModule).Assembly, opts =>
                {
                    opts.RootPath = "danh-muc";
                    opts.RemoteServiceName = "DanhMuc";
                });
                
            });
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();
            var configuration = context.GetConfiguration();

            if (Directory.Exists("" + configuration["FileUploads:RootVolume"] + ""))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider("" + configuration["FileUploads:RootVolume"] + ""),
                    RequestPath = "/Files"
                });
            }
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
                   defaults: new { controller = "Home", action = "IndexDanhMuc" },
                   null,
                   dataTokens: new[] { "newPMS.DanhMuc.Controllers" }
                   );
            });
        }
    }
}
