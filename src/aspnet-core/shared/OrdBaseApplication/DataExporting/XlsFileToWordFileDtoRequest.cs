using FlexCel.Render;
using FlexCel.XlsAdapter;
using MediatR;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace OrdBaseApplication.DataExporting
{
    public class XlsFileToWordFileDtoRequest : IRequest<FileDto>
    {
        public XlsFile XlsResult { get; set; }
        public string OutputFileNameNotExtension { get; set; }
        public bool IsSetFileName { get; set; }
        public bool ViewAllSheet { get; set; } = false;
    }
    public class XlsFileToWordFileDtoRequestHandler : IRequestHandler<XlsFileToWordFileDtoRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public XlsFileToWordFileDtoRequestHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(XlsFileToWordFileDtoRequest request, CancellationToken cancellationToken)
        {
            var fileNameOut = request.OutputFileNameNotExtension + ".docx";
            const string fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            var outputFile = request.IsSetFileName ? new FileDto(fileNameOut, fileType, request.IsSetFileName) : new FileDto(fileNameOut, fileType);
            using (var msWord = new MemoryStream())
            {
                using (var pdf = new FlexCelPdfExport(request.XlsResult, false))
                {
                    if (request.ViewAllSheet == true)
                    {
                        pdf.BeginExport(msWord);
                        pdf.ExportAllVisibleSheets(false, "In");
                        pdf.EndExport();
                        //msPdf.Position = 0;
                    }
                    else
                    {
                        pdf.Export(msWord);
                    }

                    await _factory.TempFileCacheManager.SetFileAsync(outputFile, msWord.ToArray());
                    return outputFile;
                }
            }
        }
    }
}
