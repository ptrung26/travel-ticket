using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;
using static newPMS.CommonEnum;

namespace newPMS.DanhMuc.Dtos
{
    public class TinhDto : EntityDto<string>
    {
        [Required]
        [MaxLength(100)]
        public string Ten { get; set; }

        [Required]
        [MaxLength(10)]
        public string Ma { get; set; }

        [MaxLength(50)]
        public string Cap { get; set; }

        [MaxLength(100)]
        public string TenEn { get; set; }

        [DefaultValue(true)]
        public bool IsActive { get; set; }

        public bool? IsTinhGan { get; set; }
        public string TinhGanStr { 
            get
            {
                return IsTinhGan.HasValue && IsTinhGan.Value == true ? "Có" : "Không";
            }
        }
        public string  StrTinhGan { get; set; }

        public int? PhanVung { get; set; } //PHAN_VUNG_TINH

        public string PhanVungStr
        {
            get
            {
                return PhanVung.HasValue ? GetEnumDescription((PHAN_VUNG_TINH)PhanVung) : "";
            }
        }
    }
}