using System.Collections.Generic;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Storage;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.ObjectMapping;
using Volo.Abp.Uow;
using Volo.Abp.Users;

namespace OrdBaseApplication.Factory
{
    public interface IOrdAppFactory : IScopedDependency
    {
        TService GetServiceDependency<TService>();
        IMediator Mediator { get; }
        IUnitOfWork CurrentUnitOfWork { get; }
        IUnitOfWorkManager UnitOfWorkManager { get; }
        IConfiguration AppSettingConfiguration { get; }
        IHostingEnvironment HostingEnvironment { get; }
        IRepository<TEntity, TPrimaryKey> Repository<TEntity, TPrimaryKey>()
            where TEntity : class, IEntity<TPrimaryKey>;
        IAsyncQueryableExecuter AsyncQueryableExecuter { get; }
        /// <summary>
        /// db factory cho db có connect string: default 
        /// </summary>
        IDbConnectionFactory DefaultDbFactory { get; }
        /// <summary>
        /// db factory cho db có connect string: TravelTicket 
        /// </summary>
        IDbConnectionFactory TravelTicketDbFactory { get; }
        /// <summary>
        /// db factory cho db có connect string: Portal 
        /// </summary>
        //IDbConnectionFactory PortalDbFactory { get; }
        IObjectMapper ObjectMapper { get; }
        ITempFileCacheManager TempFileCacheManager { get; }
        ICurrentUser CurrentUser { get; }
        UserSessionDto UserSession { get; }
        void ClearUserSessionCache();
        IHttpContextAccessor HttpContextAccessor { get; }
        T CloneObject<T>(object input);
    }
}
