using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Dtos
{
    public class TepDinhKemDto : EntityDto<long>
    {
        public string TenGoc { get; set; }
        public string TenLuuTru { get; set; }
        public string DinhDang { get; set; }
        public string DuongDan { get; set; }
        public string DuongDanTuyetDoi { get; set; }
    }
}