using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using newPMS.Data;
using Volo.Abp.DependencyInjection;

namespace newPMS.EntityFrameworkCore
{
    public class EntityFrameworkCorenewPMSDbSchemaMigrator
        : InewPMSDbSchemaMigrator, ITransientDependency
    {
        private readonly IServiceProvider _serviceProvider;

        public EntityFrameworkCorenewPMSDbSchemaMigrator(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task MigrateAsync()
        {
            /* We intentionally resolving the newPMSMigrationsDbContext
             * from IServiceProvider (instead of directly injecting it)
             * to properly get the connection string of the current tenant in the
             * current scope.
             */

            await _serviceProvider
                .GetRequiredService<newPMSMigrationsDbContext>()
                .Database
                .MigrateAsync();
        }
    }
}