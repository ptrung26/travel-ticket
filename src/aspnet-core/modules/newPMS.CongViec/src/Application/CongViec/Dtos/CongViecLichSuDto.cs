using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;
using System;

namespace newPMS.CongViec.Dtos
{
    public class CongViecLichSuDto : EntityDto<long>
    {
        public long? CongViecId { get; set; }
        public long? SysUserId { get; set; }
        [MaxLength(500)]
        public int TrangThai { get; set; } //TrangThai
        public string HanhDong { get; set; }
        public string GhiChu { get; set; }//Nếu có ghi chú trong bước xử lý
        public string TenNguoiThucHien { get; set; }
        public DateTime CreationTime { get; set; }
        public Guid? UserId { get; set; }
    }
}
