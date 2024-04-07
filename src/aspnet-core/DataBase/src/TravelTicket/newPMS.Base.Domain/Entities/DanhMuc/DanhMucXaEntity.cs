using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace newPMS.Entities
{
    [Table("DM_Xa")]
    public class DanhMucXaEntity : Entity<string>
    {
        [Required]
        [MaxLength(100)]
        public string Ten { get; set; }

        [MaxLength(50)]
        public string Cap { get; set; }

        [MaxLength(10)]
        [Required]
        public string HuyenId { get; set; }
        [MaxLength(10)]
        [Required]
        public string TinhId { get; set; }


        [MaxLength(100)]
        public string TenEn { get; set; }

        [DefaultValue(true)]
        public bool IsActive { get; set; }


    }
}
