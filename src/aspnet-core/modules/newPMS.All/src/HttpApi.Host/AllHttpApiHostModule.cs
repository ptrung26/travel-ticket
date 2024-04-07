using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using newPMS;
using newPMS.EntityFrameworkCore;
using newPMS.MultiTenancy;
using Ord.Niis;
using TravelTicket.CongViec;
using TravelTicket.DanhMuc;
using TravelTicket.QuanLyTaiKhoan;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Wkhtmltopdf.NetCore;
using TravelTicket;
namespace TravelTicket.All
{
    [DependsOn(
     typeof(CongViecHttpApiHostModule),
     typeof(DanhMucHttpApiHostModule),
     typeof(QuanLyTaiKhoanHttpApiHostModule),
     typeof(SharedApplicationModule),
     typeof(OrdBaseHttpApiModule),
     typeof(BaseEntityFrameworkCoreModule)
 )]
    public class AllHttpApiHostModule : AbpModule
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
            Configure<AbpExceptionHandlingOptions>(options =>
            {
                options.SendExceptionsDetailsToClients = true;
            });
            context.Services.AddWkhtmltopdf();
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
