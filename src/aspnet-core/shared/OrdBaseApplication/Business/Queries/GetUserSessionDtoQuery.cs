using Dapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Caching;
namespace OrdBaseApplication.Business.Queries
{
    public class GetUserSessionDtoQuery : IRequest<UserSessionDto>
    {
        private class Handler : IRequestHandler<GetUserSessionDtoQuery, UserSessionDto>
        {
            private readonly IOrdAppFactory _factory;

            public Handler(IOrdAppFactory factory)
            {
                _factory = factory;
            }

            public async Task<UserSessionDto> Handle(GetUserSessionDtoQuery request, CancellationToken cancellationToken)
            {
                var userId = _factory.CurrentUser?.Id;
                if (userId == null)
                {
                    return null;
                }
                var cache = _factory.GetServiceDependency<IDistributedCache<UserSessionDto>>();
                return cache.GetOrAdd(userId.ToString(), GetUserSession, () => new DistributedCacheEntryOptions
                {
                    //AbsoluteExpiration = DateTimeOffset.Now.AddHours(1)
                    //AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1)
                });

            }

            private UserSessionDto GetUserSession()
            {
                var user = _factory.CurrentUser;
                //var meBooDb = this.MeBooDbFactory.Connection;
                var defautDb = _factory.DefaultDbFactory.Connection;
                var userQuery = "SELECT Id as UserId from abpusers WHERE Id = @UserId ";
                var res = defautDb.QueryFirstOrDefault<UserSessionDto>(userQuery, new
                {
                    UserId = user.Id
                }) ?? new UserSessionDto();
                var travelTicketDb = _factory.TravelTicketDbFactory.Connection;
                var sysUser = travelTicketDb.QueryFirstOrDefault<UserSessionDto>("SELECT Id as SysUserId, HoTen, UserName as Username, Email, SoDienThoai from sysuser WHERE UserId = @UserId", new
                {
                    UserId = user.Id
                });
                if (sysUser != null)
                {
                    res.SysUserId = sysUser.SysUserId;
                    res.HoTen = sysUser?.HoTen ?? "";
                 
                    res.Username = sysUser.Username ?? "";
                    res.Email = sysUser.Email ?? "";
                    res.SoDienThoai = sysUser.SoDienThoai ?? "";
                }


                #region lấy thông tin level

                var listLevel = travelTicketDb.Query<int?>("select sysrole.Level from sysuserrole join sysrole on sysuserrole.SysRoleId = sysrole.Id where SysUserId = @UserId and sysrole.Level is not null and IsDeleted = 0", new
                {
                    UserId = res.SysUserId
                }).ToList();
                res.ListLevel = listLevel;

                #endregion

                #region Lấy thông tin khách hàng
                var khachHangUser = travelTicketDb.QueryFirstOrDefault<UserSessionDto>("SELECT KhachHangId , Id as SysUserId from sysuser WHERE UserId = @UserId", new
                {
                    UserId = user.Id
                });
                res.KhachHangId = khachHangUser?.KhachHangId;
                res.RolesLevel = khachHangUser?.RolesLevel;
                //res.TenKhachHang = khachHangUser?.TenKhachHang;
                #endregion

                #region lấy thông tin phòng ban id

                var listPhongBanId = travelTicketDb.Query<long?>("SELECT SysOrganizationunitsId from sysorganizationunitsuser WHERE SysUserId = @UserId and SysOrganizationunitsId is not null and IsDeleted = 0", new
                {
                    UserId = res.SysUserId
                }).ToList();
                res.ListPhongBanId = listPhongBanId;
                #endregion
                return res;
            }
        }
    }
}
