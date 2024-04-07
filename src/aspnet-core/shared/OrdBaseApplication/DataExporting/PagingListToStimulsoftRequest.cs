using MediatR;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using Stimulsoft.Report;
using Stimulsoft.Report.Export;
using Stimulsoft.Report.Mvc;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace OrdBaseApplication.DataExporting
{
    public enum FileExporterExtension
    {
        Excel = 1,
        Pdf = 2,
        Word = 3
    }
    public class PagingListToStimulsoftRequest: IRequest<FileDto>
    {
        public string FileName { get; set; }
        public string SampleFileName { get; set; }
        public object ListOfData { get; set; }
        public FileExporterExtension? Extension { get; set; }
    }
    public class PagingListToStimulsoftRequestHandler : IRequestHandler<PagingListToStimulsoftRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListToStimulsoftRequestHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(PagingListToStimulsoftRequest request, CancellationToken cancellationToken)
        {

            StiReport report = new StiReport();
            var path = Path.Combine(_factory.HostingEnvironment.ContentRootPath, "sampleFiles/stimulsoft", request.SampleFileName);
            report.Load(path);
            report.RegData("dtPagingList", request.ListOfData);


            switch (request.Extension)
            {
                case FileExporterExtension.Excel:
                    request.FileName += ".xlsx";
                    return await CreateFileDto(request.FileName, 
                    StiNetCoreReportResponse.ResponseAsExcel2007(report,
                        new StiExcelExportSettings
                        {
                            UseOnePageHeaderAndFooter = true
                        }).Data);

                case FileExporterExtension.Pdf:
                    request.FileName += ".pdf";
                    return await CreateFileDto(request.FileName,
                        StiNetCoreReportResponse.PrintAsPdf(report).Data);
                case FileExporterExtension.Word:
                    request.FileName += ".docx";
                    return await CreateFileDto(request.FileName, StiNetCoreReportResponse.ResponseAsWord2007(report,
                        new StiWord2007ExportSettings()
                        {
                            UsePageHeadersAndFooters = true
                        }).Data);
            }
            return new FileDto();
        }

        private async Task<FileDto> CreateFileDto(string fileName, byte[] contentBytes)
        {
            FileDto outputFile = new FileDto(fileName, fileName.GetMimeType());
            await _factory.TempFileCacheManager.SetFileAsync(outputFile, contentBytes);
            return outputFile;
        }
    }
}
