using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace TravelTicket.All
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplication<AllHttpApiHostModule>();
        }

        public void Configure(IApplicationBuilder app)
        {
            Syncfusion.Licensing.SyncfusionLicenseProvider.RegisterLicense("NTkyMjQ5QDMxMzkyZTM0MmUzME5pWlZnWjJwSHV0eDdFK0tmZUpSMTIweEgwQXQweXcrZ3ZWNVYxQmZIcWM9");
            app.InitializeApplication();
        }
    }
}
