using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("DM_NhaCungCap")]
    public class NhaCungCapEntity : FullAuditedEntity<long>
    {
        [MaxLength(500)]
        public string Ten { get; set; }

        [MaxLength(200)]
        public string TenVietTat { get; set; }

        [MaxLength(200)]
        public string DiaChi { get; set; }

        [MaxLength(6)]
        public string QuocGiaId { get; set; }

        [MaxLength(6)]
        public string TinhId { get; set; }

        [MaxLength(6)]
        public string HuyenId { get; set; }

        [MaxLength(6)]
        public string XaId { get; set; }

        [MaxLength(500)]
        public string TruSo { get; set; }

        [MaxLength(200)]
        public string DaiDien { get; set; }

        [MaxLength(20)]
        public string PhanLoai { get; set; }

        public long? CategoryId { get; set; } 

        [MaxLength(200)]
        public string SoDangKyKinhDoanh { get; set; }

        [MaxLength(500)]
        public string Logo { get; set; }

        [MaxLength(200)]
        public string TenNguoiDaiDien { get; set; }

        [MaxLength(50)]
        public string EmailNguoiDaiDien { get; set; }

        [MaxLength(20)]
        public string DienThoaiNguoiDaiDien { get; set; }

        public bool TrangThai { get; set; } // 1.Hoạt động, 2. Không hoạt động
    }
}
