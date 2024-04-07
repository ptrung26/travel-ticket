using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace newPMS.Data
{
    /* This is used if database provider does't define
     * InewPMSDbSchemaMigrator implementation.
     */
    public class NullnewPMSDbSchemaMigrator : InewPMSDbSchemaMigrator, ITransientDependency
    {
        public Task MigrateAsync()
        {
            return Task.CompletedTask;
        }
    }
}