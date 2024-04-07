using System.Collections.Generic;

namespace newPMS.DanhMuc.Dtos
{
    public class CheckValidImportExcelDanhMucHuyenDto
    {
        public string Id { get; set; }

        public string Ten { get; set; }

        public string Cap { get; set; }

        public string TenEn { get; set; }

        public string TinhId { get; set; }

        public string TenTinh { get; set; }

        public bool IsValid { get; set; }

        public bool IsActive { get; set; }
        public List<string> ListError { get; set; }

        public CheckValidImportExcelDanhMucHuyenDto()
        {
            ListError = new List<string>();
        }
    }
}