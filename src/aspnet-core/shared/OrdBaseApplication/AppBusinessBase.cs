using MediatR;
using Microsoft.Extensions.DependencyInjection;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Stimulsoft.Report.Toolbox;
using Volo.Abp.Application.Dtos;

namespace OrdBaseApplication
{
    /// <summary>et
    /// Chứa factory, Repositories , TravelTicketConnection
    /// </summary>
    public class AppBusinessBase
    {
        private IOrdAppFactory _factory;
        private IOrdRepositories _repos;
        public IOrdAppFactory Factory => LazyGetRequiredService(ref _factory);
        public IOrdRepositories Repositories => LazyGetRequiredService(ref _repos);
        public IDbConnection TravelTicketConnection => Factory.TravelTicketDbFactory.Connection;
        //public IDbConnection PortalConnection => Factory.PortalDbFactory.Connection;

        public IMediator Mediator => Factory.Mediator;

        #region LazyGetRequiredService
        public IServiceProvider ServiceProvider { get; set; }
        protected readonly object ServiceProviderLock = new object();
        protected TService LazyGetRequiredService<TService>(ref TService reference)
            => LazyGetRequiredService(typeof(TService), ref reference);
        protected TRef LazyGetRequiredService<TRef>(Type serviceType, ref TRef reference)
        {
            if (reference == null)
            {
                lock (ServiceProviderLock)
                {
                    if (reference == null)
                    {
                        reference = (TRef)ServiceProvider.GetRequiredService(serviceType);
                    }
                }
            }

            return reference;
        }
        #endregion

        #region DB có conectionString TravelTicket
        /// <summary>
        /// ExecuteSql của DB có conectionString TravelTicket
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="prms"></param>
        /// <returns></returns>
        public async Task<List<T>> TravelTicket_ExecuteSqlToListAsync<T>(string sql, object prms = null)
        {
            return (await TravelTicketConnection.QueryAsync<T>(sql, prms)).ToList();
        }
        /// <summary>
        /// ExecuteSql của DB có conectionString TravelTicket
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="prms"></param>
        /// <returns></returns>
        public async Task<T> TravelTicket_ExecuteSqlFirstOrDefaultAsync<T>(string sql, object prms = null)
        {
            return await TravelTicketConnection.QueryFirstOrDefaultAsync<T>(sql, prms);
        }
        /// <summary>
        /// ExecuteSqlFirstOrDefault của DB có conectionString TravelTicket
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="prms"></param>
        /// <param name="skipCount"></param>
        /// <param name="maxResultCount"></param>
        /// <param name="orderByPart">Không có chứa ORDER BY </param>
        /// <returns></returns>
        public async Task<PagedResultDto<T>> TravelTicket_ExecuteSqlToPagedAsync<T>(string sql, object prms = null, int skipCount = 0, int maxResultCount = 10, string orderByPart = "")
        {
            if (!string.IsNullOrEmpty(orderByPart))
            {
                orderByPart = $" ORDER BY {orderByPart} ";
            }
            var itemsTsk = TravelTicketConnection.QueryAsync<T>($"{sql} {orderByPart} LIMIT {skipCount}, {maxResultCount} ", prms);
            var totalTsk = TravelTicketConnection.QueryFirstOrDefaultAsync<int>($"select COUNT(1) FROM ({sql}) A", prms);
            await Task.WhenAll(itemsTsk,totalTsk);
            return new PagedResultDto<T>()
            {
                TotalCount = totalTsk.Result,
                Items = itemsTsk.Result.ToList()
            };
        }
        /// <summary>
        /// Updater or insert query của  DB có conectionString TravelTicket
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="prms"></param>
        /// <param name="transaction"></param>
        /// <returns></returns>
        public Task TravelTicket_ExecuteSqlAsync(string sql, object prms = null, IDbTransaction transaction = null)
        {
            return TravelTicketConnection.ExecuteAsync(sql,prms,transaction: transaction);
        }
        #endregion

        //#region DB có conectionString Portal
        ///// <summary>
        ///// ExecuteSql của DB có conectionString Portal
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="sql"></param>
        ///// <param name="prms"></param>
        ///// <returns></returns>
        //public async Task<List<T>> Portal_ExecuteSqlToListAsync<T>(string sql, object prms = null)
        //{
        //    return (await PortalConnection.QueryAsync<T>(sql, prms)).ToList();
        //}
        ///// <summary>
        ///// ExecuteSql của DB có conectionString Portal
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="sql"></param>
        ///// <param name="prms"></param>
        ///// <returns></returns>
        //public async Task<T> Portal_ExecuteSqlFirstOrDefaultAsync<T>(string sql, object prms = null)
        //{
        //    return await PortalConnection.QueryFirstOrDefaultAsync<T>(sql, prms);
        //}
        ///// <summary>
        ///// ExecuteSqlFirstOrDefault của DB có conectionString Portal
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="sql"></param>
        ///// <param name="prms"></param>
        ///// <param name="skipCount"></param>
        ///// <param name="maxResultCount"></param>
        ///// <param name="orderByPart">Không có chứa ORDER BY </param>
        ///// <returns></returns>
        //public async Task<PagedResultDto<T>> Portal_ExecuteSqlToPagedAsync<T>(string sql, object prms = null, int skipCount = 0, int maxResultCount = 10, string orderByPart = "")
        //{
        //    if (!string.IsNullOrEmpty(orderByPart))
        //    {
        //        orderByPart = $" ORDER BY {orderByPart} ";
        //    }
        //    var itemsTsk = PortalConnection.QueryAsync<T>($"{sql} {orderByPart} LIMIT {skipCount}, {maxResultCount} ", prms);
        //    var totalTsk = PortalConnection.QueryFirstOrDefaultAsync<int>($"select COUNT(1) FROM ({sql}) A", prms);
        //    await Task.WhenAll(itemsTsk, totalTsk);
        //    return new PagedResultDto<T>()
        //    {
        //        TotalCount = totalTsk.Result,
        //        Items = itemsTsk.Result.ToList()
        //    };
        //}
        ///// <summary>
        ///// Updater or insert query của  DB có conectionString Portal
        ///// </summary>
        ///// <param name="sql"></param>
        ///// <param name="prms"></param>
        ///// <param name="transaction"></param>
        ///// <returns></returns>
        //public Task Portal_ExecuteSqlAsync(string sql, object prms = null, IDbTransaction transaction = null)
        //{
        //    return PortalConnection.ExecuteAsync(sql, prms, transaction: transaction);
        //}
        //#endregion

       
    }
}
