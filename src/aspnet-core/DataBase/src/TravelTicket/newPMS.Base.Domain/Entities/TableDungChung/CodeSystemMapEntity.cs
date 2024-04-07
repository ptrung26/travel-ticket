using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace newPMS.Entities.TableDungChung
{
    /// <summary>
    /// Phục vụ các kiểu dữ liệu map lẫn nhau cho DM_CodeSystem
    /// Ví dụ hệ máy và thiết bị
    /// </summary>
    [Table("DM_CodeSystemMap")]
    public class CodeSystemMapEntity : Entity<long>
    {
        public long SourceId { get; set; }
        public long DestinationId { get; set; }
        [MaxLength(100)]
        public string CodeType { get; set; }
    }
}
