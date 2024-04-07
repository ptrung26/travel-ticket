using OrdBaseApplication.Dtos;

namespace newPMS.Dto
{
    public class PagedRequestOrganizationunitsDto : PagedFullRequestDto
    {
        public int? FormId { get; set; }
        public int? FormCase { get; set; }
        public long? OrganizationunitsId { get; set; }
        public long? SysUserId { get; set; }

    }

}
