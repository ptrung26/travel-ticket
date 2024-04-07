using System;
using System.Data;
using MicroOrm.Dapper.Repositories;
using SqlKata.Execution;

namespace OrdBaseApplication.Factory
{
    public interface IDbConnectionFactory: IDisposable
    {
        IDbConnection Connection { get; }
        IDbTransaction DbTransaction { get; }
        QueryFactory SqlKataQuery { get; }
        IDapperRepository<TEntity> MicroOrmRepository<TEntity>() where TEntity : class, new();
    }
}
