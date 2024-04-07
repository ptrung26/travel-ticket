using Hangfire;
using Hangfire.MemoryStorage;
using Hangfire.Common;
using Hangfire.RecurringJobExtensions;
using Hangfire.MySql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using newPMS.BackgroundJobManagement;
using System;
using System.Data;
using Volo.Abp;
using Volo.Abp.Modularity;

namespace TravelTicket.CongViec
{
    public static class  HangfireHelper
    {
        public static void ConfigureHangfire( this ServiceConfigurationContext context)
        {
            var configuration = context.Services.GetConfiguration();
            var connstr = configuration.GetConnectionString("Hangfire");
            // Add Hangfire services. Hangfire.AspNetCore nuget required
            context.Services.AddHangfire(configuration =>
            {
                configuration
                               .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                               .UseSimpleAssemblyNameTypeSerializer()
                               .UseStorage(new MySqlStorage(connstr, new MySqlStorageOptions()
                               {
                                   TransactionIsolationLevel = (System.Transactions.IsolationLevel?)IsolationLevel.ReadCommitted,
                                   QueuePollInterval = TimeSpan.FromSeconds(15),
                                   JobExpirationCheckInterval = TimeSpan.FromHours(1),
                                   CountersAggregateInterval = TimeSpan.FromMinutes(5),
                                   PrepareSchemaIfNecessary = true,
                                   DashboardJobListLimit = 50000,
                                   TransactionTimeout = TimeSpan.FromMinutes(1),
                                   TablesPrefix = "CongViec_Hangfire"
                               }))
                               .UseRecommendedSerializerSettings();
                configuration.UseRecurringJob(typeof(CongViecRecurringJobService));
            });
            // Add the processing server as IHostedService
            context.Services.AddHangfireServer(serverOptions =>
            {
                serverOptions.ServerName = "Hangfire.TravelTicketCongViec";
            });

        }
        public static void HangfireDashboard(this IApplicationBuilder app)
        {
            app.UseHangfireDashboard("/hangfire", new DashboardOptions() { });
            RecurringJob.AddOrUpdate<CongViecRecurringJobService>(
              "GuiCanhBaoCongViecDenHan",
              x => x.GuiCanhBaoCongViecDenHan(),
              "10 * * * *", TimeZoneInfo.Local);
        }
    }
}
