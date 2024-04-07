using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("DM_CodeSystem")]
    public class CodeSystemEntity : FullAuditedEntity<long>
    {
        [MaxLength(100)]
        public string Code { get; set; }

        [MaxLength(1000)]
        public string Display { get; set; }
        public long? ParentId { get; set; }
        [MaxLength(100)]
        public string ParentCode { get; set; }
        [MaxLength(500)]
        public string Path { get; set; }
        public int Type { get; set; }
    }
}