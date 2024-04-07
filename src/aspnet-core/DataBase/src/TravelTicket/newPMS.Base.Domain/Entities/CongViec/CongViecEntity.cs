using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities
{
    [Table("CV_CongViec")]
    public class CongViecEntity : FullAuditedEntity<long>
    {
        public long? ParentId { get; set; }
        public int? Level { get; set; }
        [MaxLength(200)]
        public string Path { get; set; }
        public string Ten { get; set; }
        public string MoTa { get; set; }
        public int? MucDo { get; set; } //Enum MUC_DO_CONG_VIEC
        public int? TrangThai { get; set; } //Enum TRANG_THAI_CONG_VIEC
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public int SoThuTu { get; set; }
        public string AnhDaiDien { get; set; }
        public string JsonTaiLieu { get; set; }
        public string NhanXet { get; set; }
        public string DanhGia { get; set; }
        public bool? IsHoanThanh { get; set; }
        public DateTime? NgayHoanThanh { get; set; }
        public bool? IsCaNhan { get; set; }
        public long SysUserId { get; set; } //Người tạo công việc

        public bool IsUuTien { get; set; } // Dự án có được ưu tiên hay không 
    }
}