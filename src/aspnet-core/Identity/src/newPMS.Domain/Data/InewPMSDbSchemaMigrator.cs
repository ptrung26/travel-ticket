using System.Threading.Tasks;

namespace newPMS.Data
{
    public interface InewPMSDbSchemaMigrator
    {
        Task MigrateAsync();
    }
}