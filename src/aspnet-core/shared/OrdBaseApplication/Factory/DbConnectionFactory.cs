using MicroOrm.Dapper.Repositories;
using MicroOrm.Dapper.Repositories.SqlGenerator;
using MySql.Data.MySqlClient;
using SqlKata.Compilers;
using SqlKata.Execution;
using System;
using System.Collections.Generic;
using System.Data;

namespace OrdBaseApplication.Factory
{
    public class DbConnectionFactory: IDbConnectionFactory
    {
        private readonly string _connectionString;
        private IDbConnection _connection;
        private IDbTransaction _transaction;

        public DbConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }
        public IDbConnection Connection => _connection ??
                                           (_connection = new MySqlConnection(_connectionString));
        public IDbTransaction DbTransaction
        {
            get
            {
               

                if (Connection.State != ConnectionState.Open && Connection.State != ConnectionState.Connecting)
                {
                    Connection.Open();
                }
                return _transaction ?? (_transaction = Connection.BeginTransaction());
            }

        }

        private QueryFactory _db;
        public QueryFactory SqlKataQuery
        {
            get
            {
                if (_db == null)
                {
                    _db = new QueryFactory(this.Connection, new MySqlCompiler());
                }

                return _db;
            }
        }

        private Dictionary<Type, object> _repositories;
        public IDapperRepository<TEntity> MicroOrmRepository<TEntity>() where TEntity : class, new()
        {
            if (_repositories == null) _repositories = new Dictionary<Type, object>();
            var type = typeof(TEntity);
            if (!_repositories.ContainsKey(type))
            {
                ISqlGenerator<TEntity> sqlGenerator = new SqlGenerator<TEntity>();
                _repositories[type] = new DapperRepository<TEntity>(this.Connection, sqlGenerator);
            }
            return (IDapperRepository<TEntity>)_repositories[type];
        }



        private bool _disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;
            if (_transaction != null)
            {
                _transaction?.Dispose();
                _transaction = null;
            }

            if (_connection != null)
            {
                _connection?.Close();
                _connection?.Dispose();
                _connection = null;
            }

            _disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
