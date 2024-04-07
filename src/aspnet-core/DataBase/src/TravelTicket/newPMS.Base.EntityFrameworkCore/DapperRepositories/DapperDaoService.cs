using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using newPMS.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Volo.Abp.EntityFrameworkCore;

namespace newPMS.DapperRepositories
{
    public class DapperDaoService : IDapperDaoService
    {
        private readonly IDbContextProvider<BaseDbContext> _dbContextProvider;

        public DapperDaoService(IDbContextProvider<BaseDbContext> dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;
        }
        public IDbConnection DbConnection => _dbContextProvider.GetDbContext().Database.GetDbConnection();

        public IDbTransaction DbTransaction => _dbContextProvider.GetDbContext().Database.CurrentTransaction?.GetDbTransaction();

        public Task<IEnumerable<T>> GetListAsync<T>(string sql, object param = null, CommandType? commandType = null)
        {
            return DbConnection.QueryAsync<T>(sql, param, DbTransaction, commandType: commandType);
        }
        public Task<IEnumerable<dynamic>> GetListAsync(string sql, object param = null, CommandType? commandType = null)
        {
            return DbConnection.QueryAsync(sql, param, DbTransaction, commandType: commandType);
        }
        public Task<T> GetFirstOrDefaultAsync<T>(string sql, object param = null, CommandType? commandType = null)
        {
            return DbConnection.QueryFirstOrDefaultAsync<T>(sql, param, DbTransaction, commandType: commandType);
        }

        public Task<dynamic> GetFirstOrDefaultAsync(string sql, object param = null, CommandType? commandType = null)
        {
            return DbConnection.QueryFirstOrDefaultAsync(sql, param, DbTransaction, commandType: commandType);
        }

        public Task ExecuteAsync(string sql, object param = null, CommandType? commandType = null)
        {
            return DbConnection.ExecuteAsync(sql, param, DbTransaction, commandType: commandType);
        }
    }
}
