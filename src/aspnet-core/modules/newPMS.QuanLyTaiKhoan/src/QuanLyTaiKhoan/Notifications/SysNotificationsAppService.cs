using Dapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.QuanLyTaiKhoan.Request;
using Newtonsoft.Json;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.QuanLyTaiKhoan.Services
{
    public class SysNotificationsService : QuanLyTaiKhoanAppService
    {
        private readonly IMediator _mediator;
        private readonly IOrdAppFactory _factory;
        public SysNotificationsService(
            IOrdAppFactory factory, IMediator mediator
            )
        {
            _factory = factory;
            _mediator = mediator;
        }

        #region PC
        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public Task<PagedResultDto<SysNotificationsDto>> GetListAsync(PagingSysNotificationsRequest request)
        {
            return _factory.Mediator.Send(request);
        }

        // Đã đọc thông báo
        [HttpPut(Utilities.ApiUrlBase + "StateNotification")]
        public async Task<CommonResultDto<bool>> StateNotification(long sysNotificationId)
        {
            try
            {
                if (sysNotificationId <= 0)
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Thông báo không tồn tại hoặc đã bị xóa!"
                    };
                }
                var notification = await _factory.Repository<SysNotificationsEntity, long>().GetAsync(sysNotificationId);
                notification.IsState = true;
                await _factory.Repository<SysNotificationsEntity, long>().UpdateAsync(notification);
                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra!"
                };
            }
        }

        //Xóa thông báo
        [HttpDelete(Utilities.ApiUrlBase + "DeleteNotification")]
        public async Task<CommonResultDto<bool>> DeleteNotification(long sysNotificationId)
        {
            try
            {
                if (sysNotificationId <= 0)
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Thông báo không tồn tại hoặc đã bị xóa!"
                    };
                }
                await _factory.Repository<SysNotificationsEntity, long>().DeleteAsync(sysNotificationId);
                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra!"
                };
            }
        }

        [HttpGet(Utilities.ApiUrlBase + "NotificationState")]
        public async Task<SysNotificationsStateDto> NotificationState()
        {
            var result = new SysNotificationsStateDto();
            var _sysNotificationsRepos = _factory.Repository<SysNotificationsEntity, long>().AsNoTracking();
            var _organizationUserRepos = _factory.Repository<SysOrganizationunitsUser, long>().AsNoTracking();
            var userSession = _factory.UserSession;
            //Lấy ra list roleId của user
            var listSysUserRole = _factory.Repository<SysUserRoleEntity, long>().Where(x => x.SysUserId == userSession.SysUserId).Select(x => x.SysRoleId).ToList();
            var listMaSysRole = new List<string>();
            if (listSysUserRole?.Count > 0)
            {
                //Lấy ra mã trong bảng sysrole
                listMaSysRole = _factory.Repository<SysRoleEntity, long>().Where(x => listSysUserRole.Contains(x.Id)).Select(x => x.Ma).ToList();

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
            var listPermission = _factory.DefaultDbFactory.Connection.Query<ApbPermissionGrantsDto>(strBuilder.ToString()).ToList();
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
                var listCheckPermission = new System.Collections.Generic.List<NameApbPermissionGrantsDto>();
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
                             .OrderByDescending(x => x.CreationTime)
                             select new SysNotificationsDto
                             {
                                 Id = tb.Id,
                                 NotificationType = tb.NotificationType,
                                 Message = tb.Message,
                                 IsState = tb.IsState,
                                 CreationTime = tb.CreationTime,
                             });
                result.ListNotifications= await query.Take(5).ToListAsync();
                result.TotalNotification = await query.CountAsync();
                result.TotalNotificationState = await query.Where(x => x.IsState==null || x.IsState==false).CountAsync();
            }
            return result;
        }
        #endregion

        #region Mobile
        public async Task<bool> NotifyAsync(string to, string title, string body)
        {
            try
            {

                // Get the server key from FCM console
                var serverKey = string.Format("key={0}", "AAAAkOhlN0s:APA91bFcRIMG3uBJtH1hGGhG2R12rCEHYei4cpv6n2BuzBg63QSiA42k9O8RUkp81HVxDDueDouuR24wc2acCjpJIB3RAfrL97CIeCYjLsYKjNXULB7my3OTzmJx1glCluclkJROMz-J");

                // Get the sender id from FCM console
                var senderId = string.Format("id={0}", "622374238027");

                var data = new
                {
                    to, // Recipient device token
                    notification = new { title, body }
                };

                // Using Newtonsoft.Json
                var jsonBody = JsonConvert.SerializeObject(data);

                using (var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://fcm.googleapis.com/fcm/send"))
                {
                    httpRequest.Headers.TryAddWithoutValidation("Authorization", serverKey);
                    httpRequest.Headers.TryAddWithoutValidation("Sender", senderId);
                    httpRequest.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                    using (var httpClient = new HttpClient())
                    {
                        var result = await httpClient.SendAsync(httpRequest);

                        if (result.IsSuccessStatusCode)
                        {
                            return true;
                        }
                        else
                        {

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return false;
        }
        #endregion
    }
}