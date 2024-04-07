using System.Collections.Generic;
namespace newPMS.DanhMuc.Dtos
{
    public class CheckValidImportExcelCodeSystemDto
    {
        public string Display { get; set; }
        public string Code { get; set; }
        public bool IsValid { get; set; }
        public string ParentCode { get; set; }
        public long? ParentId { get; set; }

        public string NgayTao { get; set; }

        public long Id { get; set; }

        public List<string> ListError { get; set; }

        public CheckValidImportExcelCodeSystemDto()
        {
            ListError = new List<string>();
        }
    }
}