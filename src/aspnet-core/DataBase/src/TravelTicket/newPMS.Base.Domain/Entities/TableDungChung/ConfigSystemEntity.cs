using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("DM_ConfigSystem")]
    public class ConfigSystemEntity : FullAuditedEntity<long>
    {
        public int Type { get; set; }
        [MaxLength(100)]
        public string Ma { get; set; }
        public string GiaTri { get; set; }
        public string MoTa { get; set; }
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
    }
}