using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.DichVu
{
    [Table("DV_GiaPhong")]
    public class DichVuGiaPhongEntity : FullAuditedEntity<long>
    {
        public long NhaCungCapKhachSanId { get; set; }
        public long HangPhongId { get; set; }
        public string LoaiPhongCode { get; set; }
        public string LoaiTienTeCode { get; set; }
        public decimal GiaFOTNettNgayThuong { get; set; }
        public decimal GiaFOTBanNgayThuong { get; set; }
        public decimal GiaFOTNettNgayLe { get; set; }
        public decimal GiaFOTBanNgayLe { get; set; }
        public DateTime NgayApDungTu { get; set; }
        public DateTime NgayApDungDen { get; set; }
        public string GhiChu { get; set; }
        public bool IsHasThueVas { get; set; }
    }
}
