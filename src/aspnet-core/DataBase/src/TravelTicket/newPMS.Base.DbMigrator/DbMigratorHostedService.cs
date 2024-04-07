using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using newPMS.DapperRepositories;
using newPMS.Data;
using Serilog;
using Volo.Abp;
using Volo.Abp.Uow;

namespace newPMS.DbMigrator
{
    public class DbMigratorHostedService : IHostedService
    {
        private readonly IHostApplicationLifetime _hostApplicationLifetime;

        public DbMigratorHostedService(IHostApplicationLifetime hostApplicationLifetime)
        {
            _hostApplicationLifetime = hostApplicationLifetime;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using (var application = AbpApplicationFactory.Create<BaseDbMigratorModule>(options =>
                {
                    options.UseAutofac();
                    options.Services.AddLogging(c => c.AddSerilog());
                }))
            {
                application.Initialize();

                await application
                    .ServiceProvider
                    .GetRequiredService<BaseDbMigrationService>()
                    .MigrateAsync();
                var unitOfWorkManager = application.ServiceProvider.GetRequiredService<IUnitOfWorkManager>();
                using (var uow = unitOfWorkManager.Begin(requiresNew: true, isTransactional: false))
                {
                    var dapperDao = application.ServiceProvider.GetRequiredService<IDapperDaoService>();
                    await uow.CompleteAsync();
                }

                application.Shutdown();


                _hostApplicationLifetime.StopApplication();
            }

        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}