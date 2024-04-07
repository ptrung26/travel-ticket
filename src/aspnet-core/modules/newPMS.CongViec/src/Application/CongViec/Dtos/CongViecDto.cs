using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace newPMS.CongViec.Dtos
{
    public class CongViecDto : EntityDto<long>
    {
        public long? ParentId { get; set; }
        public string Ten { get; set; }
        public string MoTa { get; set; }
        public int? MucDo { get; set; } //Enum MUC_DO_CONG_VIEC
        public int? TrangThai { get; set; } //Enum TRANG_THAI_CONG_VIEC
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public string JsonTaiLieu { get; set; }
        public string NhanXet { get; set; }
        public string DanhGia { get; set; }
        public int SoViec { get; set; }//Đếm số mục trong danh sách công việc
        public string IdCongViecStr { get; set; }
        public int SoViecDaHoanThanh { get; set; } //Đếm số việc đã hoàn thành
        public string IdCongViecHoanThanhStr { get; set; }
        public int SoTaiLieu { get; set; } //Đếm số tài liệu đính kèm công việc
        public int SoTraoDoi { get; set; } //Đếm số trao đổi trong công việc
        public List<CongViecUserDto> ListUser { get; set; }
        public int? Level { get; set; }//Enum: LEVEL_CONG_VIEC
        public int SoThuTu { get; set; }
        public bool? IsMyCongViec { get; set; }
        public bool? IsHoanThanh { get; set; }
        public DateTime? NgayHoanThanh { get; set; }
        public bool? IsCaNhan { get; set; }
        public decimal? PhanTramHoanThanh { get; set; }
        public long SysUserId { get; set; }
        public bool? IsMyCreate { get; set; }
        
        public bool IsUuTien { get; set;  }
        public List<CongViecDto> Children { get; set; } = new List<CongViecDto>();

        /* 
         * khi get dự án trưởng phòng được tham gia thì check xem công việc giao cho
           trưởng phòng trong dự án đó đã >= trạng thái đã tạo mới hay chưa
         */
        public int? SoCongViecDangThucHien { get; set; }
    }

    public class ResultUpload
    {
        public string Url { get; set; }
        public string Path { get; set; }
        public string FileName { get; set; }
        public string Name { get; set; }
        public bool Status { get; set; }
        public string Type { get; set; }
        public string Msg { get; set; }
        public string Token { get; set; }
    }
}
