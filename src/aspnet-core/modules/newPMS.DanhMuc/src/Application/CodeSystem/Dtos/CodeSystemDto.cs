using Volo.Abp.Application.Dtos;
namespace newPMS.DanhMuc.Dtos
{
    public class CodeSystemDto : EntityDto<long>
    {
        public string Code { get; set; }
        public string Display { get; set; }
        public long? ParentId { get; set; }
        public string ParentCode { get; set; }
        public string NgayTao { get; set; }
         
        public string LoaiDanhMuc { get; set; }
    }
}
