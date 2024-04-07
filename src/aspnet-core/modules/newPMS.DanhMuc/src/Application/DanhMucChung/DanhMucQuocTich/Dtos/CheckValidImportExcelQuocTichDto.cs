using System.Collections.Generic;

namespace newPMS.DanhMuc.Dtos
{
    public class CheckValidImportExcelQuocTichDto
    {
        public int Stt { get; set; }
        public string Id { get; set; }
        public string Ten { get; set; }
        public string TenEn { get; set; }

        public string Alpha2Code { get; set; }
        public string Alpha3Code { get; set; }
        public bool IsValid { get; set; }
        public List<string> ListError { get; set; }

        public CheckValidImportExcelQuocTichDto()
        {
            ListError = new List<string>();
        }
    }
}