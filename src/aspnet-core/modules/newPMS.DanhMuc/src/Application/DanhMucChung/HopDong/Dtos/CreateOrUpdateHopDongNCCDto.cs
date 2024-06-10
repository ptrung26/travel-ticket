using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Dtos
{
    public class CreateOrUpdateHopDongNCCDto : EntityDto<long>
    {
        public long NhaCungCapId { get; set; }
        public string Ma { get; set; }
        public string LoaiHopDongCode { get; set; }
        public DateTime NgayHieuLuc { get; set; }
        public DateTime NgayHetHan { get; set; }
        public DateTime NgayKy { get; set; }
        public string NguoiLapHopDong { get; set; }
        public int TinhTrang { get; set; } // 1. Đã tạo, 2. Đã ký, 3. Đã huỷ, 4. Đã hết hạn 
        public string MoTa { get; set; }

    }
}
