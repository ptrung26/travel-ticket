using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Dtos
{
    public class NguoiLienHeNCCDto : EntityDto<long>
    {
        public string HoVaTen { get; set; }
        public string PhongBan { get; set; }
        public string ChucVu { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public long NhaCungCapId { get; set; }
        public string NhaCungCapCode { get; set; }
    }
}

