using System.Collections.Generic;

namespace newPMS.DanhMuc.Dtos
{
    public class CheckValidImportExcelXaDto
    {
        public string TinhId { get; set; }
        public string HuyenId { get; set; }
        public string Id { get; set; }
        public string Ten { get; set; }
        public string Cap { get; set; }
        public bool IsActive { get; set; }
        public bool IsValid { get; set; }
        public List<string> ListError { get; set; }

        public CheckValidImportExcelXaDto()
        {
            ListError = new List<string>();
        }
    }
}