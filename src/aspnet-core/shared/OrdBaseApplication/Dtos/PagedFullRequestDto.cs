using PMS;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace OrdBaseApplication.Dtos
{
    public class PagedFullRequestDto : PagedAndSortedResultRequestDto
    {
        private string _filter;
        public string Filter
        {
            get => _filter;
            set => _filter = !string.IsNullOrEmpty(value) ? value.Trim() : value;
        }
        public bool? IsActive { get; set; }

        public string FilterFullText => $"%{Filter}%";
        public string MySqlFullTextSearch => string.IsNullOrEmpty(Filter) ? null : $"\"{Filter}\"";

        public void Format()
        {
            if (!string.IsNullOrEmpty(this.Filter))
            {
                this.Filter = this.Filter
                    .ToLower()
                    .Trim()
                    .Replace("  ", " ");
                this.Filter = ApplicationUtility.ConvertToUnsign(this.Filter);
            }
        }        

    }
    public class PagedFullExportRequestDto : PagedFullRequestDto
    {
        // biến dành cho export file
        public ExportModel? ExportMode { get; set; }
        public OutputFileExtension? OutputFileExtension { get; set; }
    }

    public enum ExportModel
    {
        Default = 0,
        TrangHienTai = 1,
        ToanBo = 2
    }

    public enum OutputFileExtension
    {
        /// <summary>
        /// Định dạng xlsx
        /// </summary>
        Excel = 1,
        Pdf = 2,
        Word = 3,
        /// <summary>
        /// Định dạng xls
        /// </summary>
        Excel2003 = 4,
        PdfAllSheet = 5,
    }
}
