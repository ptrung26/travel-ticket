using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Dtos
{
    public class QuocTichDto : EntityDto<string>
    {
        [MaxLength(100)]
        [Required]
        public string Ten { get; set; }

        [MaxLength(100)]
        public string TenEn { get; set; }

        [StringLength(2, MinimumLength = 2)]
        public string Alpha2Code { get; set; }

        [StringLength(3, MinimumLength = 3)]
        public string Alpha3Code { get; set; }
    }
}