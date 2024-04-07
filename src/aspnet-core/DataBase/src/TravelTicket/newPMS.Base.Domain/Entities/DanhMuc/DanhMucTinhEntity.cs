using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace newPMS.Entities
{
    [Table("DM_Tinh")]
    public class DanhMucTinhEntity : Entity<string>
    {
        [Required]
        [MaxLength(100)]
        public string Ten { get; set; }

        [Required]
        [MaxLength(50)]
        public string Ma { get; set; }

        [MaxLength(50)]
        public string Cap { get; set; }

        [MaxLength(100)]
        public string TenEn { get; set; }

        [DefaultValue(true)]
        public bool IsActive { get; set; }

        public bool? IsTinhGan { get; set; }

        public int? PhanVung { get; set; } //PHAN_VUNG_TINH
    }
}
