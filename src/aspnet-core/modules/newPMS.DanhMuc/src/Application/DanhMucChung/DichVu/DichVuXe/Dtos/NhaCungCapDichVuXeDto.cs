using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Dtos
{
    public class NhaCungCapDichVuXeDto : EntityDto<long>
    {
        public string Ten { get; set; }
        public long? QuocGiaId { get; set; }
        public string QuocGia { get; set; }
        public long? TinhId { get; set; }
        public string Tinh { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public bool IsHasThueVAT { get; set; }
        public List<DichVuXeDto> ListDichVuXe { get; set;}
    }
}
