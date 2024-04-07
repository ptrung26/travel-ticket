using Dapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.QuanLyTaiKhoan.Dtos;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.QuanLyTaiKhoan.Request
{
    public class PagingSysNotificationsRequest : PagedFullRequestDto, IRequest<PagedResultDto<SysNotificationsDto>>
    {
        public bool? IsState { get; set; }
    }

    public class PagingSysNotificationsHandler : AppBusinessBase, IRequestHandler<PagingSysNotificationsRequest, PagedResultDto<SysNotificationsDto>>
    {
        public async Task<PagedResultDto<SysNotificationsDto>> Handle(PagingSysNotificationsRequest input, CancellationToken cancellationToken)
        {
            try
            {
                var _sysNotificationsRepos = Factory.Repository<SysNotificationsEntity, long>().AsNoTracking();
                var _organizationUserRepos = Factory.Repository<SysOrganizationunitsUser, long>().AsNoTracking();
                var userSession = Factory.UserSession;
                //Lấy ra list roleId của user
                var listSysUserRole = Factory.Repository<SysUserRoleEntity, long>().Where(x => x.SysUserId == userSession.SysUserId).Select(x => x.SysRoleId).ToList();
                var listMaSysRole = new List<string>();
                if (listSysUserRole?.Count > 0)
                {
                    //Lấy ra mã trong bảng sysrole
                    listMaSysRole = Factory.Repository<SysRoleEntity, long>().Where(x => listSysUserRole.Contains(x.Id)).Select(x => x.Ma).ToList();

                    //Add thêm userId vào listMaSysrole
                    listMaSysRole.Add(userSession.UserId.ToString());
                }

                var strBuilder = new StringBuilder($@"
                    SELECT
	                    * 
                    FROM
	                    abppermissiongrants 
                    WHERE
	                    ProviderKey IN ({ string.Join(", ", listMaSysRole.Select(x => $"'{x}'").ToArray())}) 
                ");
                var listPermission = Factory.DefaultDbFactory.Connection.Query<ApbPermissionGrantsDto>(strBuilder.ToString()).ToList();
                var lstNameApbPermissionGrants = new List<NameApbPermissionGrantsDto>()
                {
                    new NameApbPermissionGrantsDto
                    {
                        Name = "NgoaiKiem",
                        From = 0,
                        To = 39
                    },
                    new NameApbPermissionGrantsDto
                    {
                        Name = "VanBan",
                        From = 40,
                        To = 49
                    }
                };

                if (listPermission?.Count > 0)
                {
                    var listCheckPermission = new List<NameApbPermissionGrantsDto>();
                    foreach (var p in lstNameApbPermissionGrants)
                    {
                        if (listPermission.Any(x => x.Name.Contains(p.Name)))
                        {
                            listCheckPermission.Add(p);
                        }
                    }

                    var fromNotifi = 0;
                    var toNotifi = 1000;
                    if (listCheckPermission?.Count > 0)
                    {
                        fromNotifi = listCheckPermission[0].From;
                        toNotifi = listCheckPermission[listCheckPermission.Count - 1].To;
                    }

                    List<long> listOrganition = (from tb in _organizationUserRepos.Where(x => x.SysUserId == userSession.SysUserId)
                                                 select new
                                                 {
                                                     Id = tb.SysOrganizationunitsId
                                                 }
                                ).Select(x => x.Id).ToList();

                    var query = (from tb in _sysNotificationsRepos
                                 .Where(x => (listOrganition.Contains(x.SysOrganizationunitsId.Value) || x.SysUserId == userSession.SysUserId) 
                                           && x.NotificationType >= fromNotifi && x.NotificationType <= toNotifi)
                                 select new SysNotificationsDto
                                 {
                                     Id = tb.Id,
                                     NotificationType = tb.NotificationType,
                                     Message = tb.Message,
                                     IsState = tb.IsState,
                                     CreationTime = tb.CreationTime,
                                 })
                                 .WhereIf(!string.IsNullOrEmpty(input.Filter), x => x.Message.ToLower().Contains(input.Filter.Trim().ToLower()))
                                 .WhereIf(input.IsState.HasValue, p => p.IsState == input.IsState.Value).OrderByDescending(x => x.Id);
                    var dataGrids = await query.PageBy(input).ToListAsync(cancellationToken);

                    return new PagedResultDto<SysNotificationsDto>(query.Count(), dataGrids);
                }

                return new PagedResultDto<SysNotificationsDto>();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
