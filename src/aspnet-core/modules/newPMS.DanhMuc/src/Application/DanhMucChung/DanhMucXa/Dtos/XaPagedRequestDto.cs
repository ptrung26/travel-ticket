using OrdBaseApplication.Dtos;

namespace newPMS.DanhMuc.Dtos
{
    public class XaPagedRequestDto : PagedFullRequestDto
    {
        public string HuyenId { get; set; }
        public string TinhId { get; set; }
    }
}