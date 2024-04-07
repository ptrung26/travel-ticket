using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace newPMS
{
    public class newPMSWebTestStartup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplication<newPMSWebTestModule>();
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            app.InitializeApplication();
        }
    }
}
