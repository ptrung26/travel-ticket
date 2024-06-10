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
    [Table("DM_NhaCungCapVe")]
    public class NhaCungCapVeEntity : FullAuditedEntity<long>
    {
        [Required]
        [MaxLength(50)]
        public string Ma { get; set; }
        [Required]
        public string Ten { get; set; }
        public bool TinhTrang { get; set; }
        public long? QuocGiaId { get; set; }
        public long? TinhId { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Website { get; set; }
        public string MoTa { get; set; }
        public string AnhDaiDienUrl { get; set; }
        public string TaiLieuJson { get; set; }
        public bool IsHasVAT { get; set; }
        public string DichVu { get; set; }
        public int? SoSaoDanhGia { get; set; }
        public string MaSoThue { get; set; }
        public DateTime NgayHetHanHopDong { get; set; }
    }
}
