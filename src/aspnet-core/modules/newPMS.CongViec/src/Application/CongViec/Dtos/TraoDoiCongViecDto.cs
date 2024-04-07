using System;
using Volo.Abp.Application.Dtos;

namespace newPMS.CongViec.Dtos
{
    public class TraoDoiCongViecDto : EntityDto<long>
    {
        public long? CongViecId { get; set; }
        public long? SysUserId { get; set; }
        public long? ParentId { get; set; }
        public string NoiDung { get; set; }
        public bool IsMyPost { get; set; }
        public DateTime NgayDang { get; set; }
        public string HoTen { get; set; }
        public string Avatar { get; set; }
        public Guid UserId { get; set; }
    }
}
