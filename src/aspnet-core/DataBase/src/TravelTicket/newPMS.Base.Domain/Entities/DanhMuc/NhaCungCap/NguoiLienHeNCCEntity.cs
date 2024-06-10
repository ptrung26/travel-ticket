using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.DanhMuc.NhaCungCap
{
    [Table("DM_NguoiLienHeNCC")]
    public class NguoiLienHeNCCEntity : FullAuditedEntity<long>
    {
        [Required]
        public string HoVaTen { get; set; }
        public string PhongBan { get; set; }
        public string ChucVu { get; set; }
        public string DienThoai { get; set; }
        [Required]
        public string Email { get; set; }

        // Dùng để map ra thông tin nhà cung cấp
        public long NhaCungCapId { get; set; }
        public string NhaCungCapCode { get; set; }
    }
}
