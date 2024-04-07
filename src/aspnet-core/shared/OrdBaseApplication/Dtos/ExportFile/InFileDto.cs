namespace OrdBaseApplication.Dtos.ExportFile
{
    /// <summary>
    /// Bao gồm định dạng pdf và excel 
    /// </summary>
    public class InFileDto
    {
        public FileDto ExcelFile { get; set; }
        public FileDto PdfFile { get; set; }
        public string TenFileMau { get; set; }

        public FileDto ExcelFileBCBHYT4210 { get; set; }
    }
}
