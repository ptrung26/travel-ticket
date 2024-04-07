using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Dtos
{
    public class HuyenDto : EntityDto<string>
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

        public string TenTinh { get; set; }
    }
}