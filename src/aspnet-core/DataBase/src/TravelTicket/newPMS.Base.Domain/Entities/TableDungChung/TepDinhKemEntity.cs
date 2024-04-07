using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("DM_TepDinhKem")]
    public class TepDinhKemEntity : FullAuditedEntity<long>
    {
        public long? IdDanhMuc { get; set; } //Id của bản ghi
        public int? LoaiDanhMuc { get; set; }//Enum danh mục

        [MaxLength(500)]
        public string TenGoc { get; set; }

        [MaxLength(500)]
        public string TenLuuTru { get; set; }

        [MaxLength(250)]
        public string DinhDang { get; set; }

        [MaxLength(1000)]
        public string DuongDan { get; set; }
        [MaxLength(1000)]
        public string DuongDanTuyetDoi { get; set; }
    }
}