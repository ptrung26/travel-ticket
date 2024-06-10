using OrdBaseApplication.Factory;
using System.Collections.Generic;

namespace newPMS.Common.Dtos
{
    public class GetComboDataFromDataBaseInputDto
    {
        public string TableName { get; set; }
        public long? CascaderId { get; set; }
        public string CascaderCode { get; set; }
        public string CascaderMa { get; set; }
        public List<string> ListCascaderCode;
        public int? TrangThai { get; set; }
        public void Format(IOrdAppFactory factory)
        {

        }
    }

    public class TreeOrganizationDto
    {
        public long Id { get; set; }
        public string MaPhongBan { get; set; }
        public string TenPhongBan { get; set; }
        public long? PId { get; set; }
        public int Level { get; set; }
    }
}
