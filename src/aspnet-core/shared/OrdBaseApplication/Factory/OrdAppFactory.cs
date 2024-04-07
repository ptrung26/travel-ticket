using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using OrdBaseApplication.Business.Queries;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Storage;
using System;
using System.Collections.Generic;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.ObjectMapping;
using Volo.Abp.Threading;
using Volo.Abp.Uow;
using Volo.Abp.Users;

namespace OrdBaseApplication.Factory
{
    public class OrdAppFactory : IOrdAppFactory, IDisposable
    {
        #region LazyGetRequiredService
        private readonly object _lock = new object();
        private readonly IAbpLazyServiceProvider _lazyServiceProvider;
  
        public OrdAppFactory(IAbpLazyServiceProvider lazyServiceProvider)
        {
            _lazyServiceProvider = lazyServiceProvider;
        }

        private Dictionary<Type, object> _serviceDependencies;
        public TService GetServiceDependency<TService>()
        {
            lock (_lock)
            {
                if (_serviceDependencies == null)
                {
                    _serviceDependencies = new Dictionary<Type, object>();
                }
                var type = typeof(TService);
                if (!_serviceDependencies.ContainsKey(type))
                {
                    _serviceDependencies[type] = _lazyServiceProvider.LazyGetRequiredService<TService>();
                }
                return (TService)_serviceDependencies[type];
            }
        }

        #endregion

        #region Repository
        public IRepository<TEntity, TPrimaryKey> Repository<TEntity, TPrimaryKey>() where TEntity : class, IEntity<TPrimaryKey>
        {
            return GetServiceDependency<IRepository<TEntity, TPrimaryKey>>();
        }
        #endregion

        public IConfiguration AppSettingConfiguration => GetServiceDependency<IConfiguration>();
        private IDbConnectionFactory _defaultConn;
        public IDbConnectionFactory DefaultDbFactory
        {
            get
            {
                if (_defaultConn == null)
                {
                    _defaultConn = new DbConnectionFactory(AppSettingConfiguration.GetConnectionString("Default"));
                }

                return _defaultConn;
            }
        }
        private IDbConnectionFactory _conn;
        public IDbConnectionFactory TravelTicketDbFactory
        {
            get

            {
                if (_conn == null)
                {
                    _conn = new DbConnectionFactory(AppSettingConfiguration.GetConnectionString("TravelTicket"));
                }

                return _conn;
            }
        }

        //private IDbConnectionFactory _portalConn;
        //public IDbConnectionFactory PortalDbFactory
        //{
        //    get

        //    {
        //        if (_portalConn == null)
        //        {
        //            _portalConn = new DbConnectionFactory(AppSettingConfiguration.GetConnectionString("Portal"));
        //        }

        //        return _portalConn;
        //    }
        //}

        public IMediator Mediator => GetServiceDependency<IMediator>();
        public IUnitOfWorkManager UnitOfWorkManager => GetServiceDependency<IUnitOfWorkManager>();
        public IUnitOfWork CurrentUnitOfWork => UnitOfWorkManager?.Current;

        public IObjectMapper ObjectMapper => GetServiceDependency<IObjectMapper>();
        public ITempFileCacheManager TempFileCacheManager => GetServiceDependency<ITempFileCacheManager>();
        public IHostingEnvironment HostingEnvironment => GetServiceDependency<IHostingEnvironment>();
        public ICurrentUser CurrentUser => GetServiceDependency<ICurrentUser>();
        public IAsyncQueryableExecuter AsyncQueryableExecuter => GetServiceDependency<IAsyncQueryableExecuter>();
        public IHttpContextAccessor HttpContextAccessor => GetServiceDependency<IHttpContextAccessor>();


        #region Get UserCurrent

        public UserSessionDto UserSession
        {
            get
            {
                return AsyncHelper.RunSync(() => Mediator.Send(new GetUserSessionDtoQuery()));
            }
        }

        public void ClearUserSessionCache()
        {
            var user = this.CurrentUser;
            if (user.Id.HasValue)
            {
                IDistributedCache<UserSessionDto> cache = GetServiceDependency<IDistributedCache<UserSessionDto>>();
                cache.Remove(user.Id.ToString());
                cache.Refresh(user.Id.ToString());
            }
        }
        #endregion

        public T CloneObject<T>(object input)
        {
            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(input));
        }

        #region Dispose

        private bool _disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;
            lock (_lock)
            {
                _serviceDependencies = null;
            }
            _disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }

        #endregion
    }
}
