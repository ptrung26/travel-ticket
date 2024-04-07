using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Dtos
{
    public class ConfigSystemDto : EntityDto<long>
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