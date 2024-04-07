using System.Collections.Generic;

namespace newPMS.DanhMuc.Dtos
{
    public class CheckValidImportExcelDanhMucTinhDto
    {
        public string Id { get; set; }

        public string Ten { get; set; }
        public string Ma { get; set; }

        public string Cap { get; set; }

        public string TenEn { get; set; }

        public bool IsValid { get; set; }

        public bool IsActive { get; set; }

        public bool? IsTinhGan { get; set; }

        public string StrTinhGan { get; set; }

        public int? PhanVung { get; set; } //PHAN_VUNG_TINH
        public string StrPhanVung { get; set; } //PHAN_VUNG_TINH

        public List<string> ListError { get; set; }

        public CheckValidImportExcelDanhMucTinhDto()
        {
            ListError = new List<string>();
        }
    }
}