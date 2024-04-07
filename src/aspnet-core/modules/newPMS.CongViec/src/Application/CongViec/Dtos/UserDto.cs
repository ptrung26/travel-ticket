using System;
using Volo.Abp.Application.Dtos;

namespace newPMS.CongViec.Dtos
{
    public class CongViecUserDto : EntityDto<long>
    {
        public Guid? UserId { get; set; }
        public string Email { get; set; }

        public long? CongViecId { get; set; }
        public string Ten { get; set; }
        public long? SysUserId { get; set; }
        public string HoTen { get; set; }
        public string AnhDaiDien { get; set; }
        public string UserName { get; set; }
        public int SoCongViecDangThucHien { get; set; } //Số công việc của user ở trạng thái đang làm việc
        public bool IsLanhDao { get; set; }
        public bool IsNhanVien { get; set; }
        public bool IsTruongPhong { get; set; }

        public DateTime? NgayKetThuc { get; set; }
        public DateTime? NgayHoanThanh { get; set;  }
        public bool IsHoanThanh { get; set; }
        public bool IsDenHan { get; set; }



    }

    public class CongViecRoleDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ProviderName { get; set; }
        public string ProviderKey { get; set; }
    }
}
