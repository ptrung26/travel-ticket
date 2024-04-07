using System.Threading.Tasks;

namespace newPMS.Data
{
    public interface IBaseDbSchemaMigrator
    {
        Task MigrateAsync();
    }
}