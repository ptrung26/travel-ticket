using OrdBaseApplication.Dtos;
namespace newPMS.DanhMuc.Dtos
{
    public class CodeSystemRequestDto : PagedFullRequestDto
    {
        public long? parentId { get; set; }
    }
}