using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("SysNotifications")]
    public class SysNotificationsEntity : FullAuditedEntity<long>
    {
        public int? NotificationType { get; set; } //Enum notification
        public string Message { get; set; } //Tin nhắn
        public bool? IsState { get; set; } //Đã đọc hay chưa?
        public long? SysOrganizationunitsId { get; set; } //Thông báo cho cả khoa phòng
        public long? SysUserId { get; set; } //Thông báo riêng cho người dùng
    }
}
