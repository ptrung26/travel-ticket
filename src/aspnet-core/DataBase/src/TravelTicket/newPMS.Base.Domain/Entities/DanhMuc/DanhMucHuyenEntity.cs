using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("DM_Huyen")]
    public class DanhMucHuyenEntity : Entity<string>
    {
        [Required]
        [MaxLength(100)]
        public string Ten { get; set; }

        [MaxLength(50)]
        public string Cap { get; set; }

        [MaxLength(100)]
        public string TenEn { get; set; }

        [Required]
        [MaxLength(10)]
        public string TinhId { get; set; }

        [DefaultValue(true)]
        public bool IsActive { get; set; }
    }
}
