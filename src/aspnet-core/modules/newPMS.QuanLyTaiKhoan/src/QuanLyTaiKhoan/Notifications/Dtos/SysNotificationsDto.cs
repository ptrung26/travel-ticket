using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class SysNotificationsDto : EntityDto<long>
    {
        public int? NotificationType { get; set; } //Enum notification
        public string Message { get; set; }
        public bool? IsState { get; set; }
        public long? SysOrganizationunitsId { get; set; } //Thông báo cho cả khoa phòng
        public long? SysUserId { get; set; } //Thông báo riêng cho người dùng
        public DateTime? CreationTime { get; set; }
    }

    public class NameApbPermissionGrantsDto
    {
        public string Name { get; set; }
        public int From { get; set; }
        public int To { get; set; }
    }

    public class ApbPermissionGrantsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ProviderName { get; set; }
        public string ProviderKey { get; set; }
    }
    public class SysNotificationsStateDto
    {
        public List<SysNotificationsDto> ListNotifications { get; set; }
        public long TotalNotification { get; set; }
        public long TotalNotificationState { get; set; }
    }
}
