using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.KhachHang.Dtos
{
    public class KhachHangDto : EntityDto<long>
    {
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string SoDienThoai { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public long? NguoiTaoId { get; set; }
        public string TenNguoiTao { get; set; }
        public long? SysUserId { get; set; }
        public string TenTaiKhoan { get; set; }
    }
}
