namespace newPMS.QuanLyTaiKhoan
{
    public interface IAppFolders
    {
        string SampleProfileImagesFolder { get; }
        string Images { get; }
        string Template { get; set; }
        string Fonts { get; set; }

        string WebLogsFolder { get; set; }
    }
}