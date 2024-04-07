using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("SysOrganizationunits")]
    public class SysOrganizationunits : FullAuditedEntity<long>
    {
        public Guid OrganizationunitsId { get; set; }
        public long? PId { get; set; }
        [StringLength(50)]
        public string MaPhongBan { get; set; }
        [StringLength(255)]
        public string TenPhongBan { get; set; }
        [StringLength(255)]
        public string TenPhongBanKhongDau { get; set; }
        [StringLength(500)]
        public string Email { get; set; }
        [StringLength(50)]
        public string SoDienThoai { get; set; }
        [StringLength(255)]
        public string Fax { get; set; }
        public int? LoaiPhongBan { get; set; }
    }
}
