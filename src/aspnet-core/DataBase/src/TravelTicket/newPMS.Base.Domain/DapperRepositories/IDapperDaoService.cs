using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace newPMS.DapperRepositories
{
    public interface IDapperDaoService : IScopedDependency
    {
        Task<IEnumerable<T>> GetListAsync<T>(string sql, object param = null, CommandType? commandType = null);
        Task<IEnumerable<dynamic>> GetListAsync(string sql, object param = null, CommandType? commandType = null);
        Task<T> GetFirstOrDefaultAsync<T>(string sql, object param = null, CommandType? commandType = null);
        Task<dynamic> GetFirstOrDefaultAsync(string sql, object param = null, CommandType? commandType = null);
        Task ExecuteAsync(string sql, object param = null, CommandType? commandType = null);
    }
}
