using Abp.AspNetZeroCore.Net;
using MediatR;
using newPMS.Shared.Utils;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using Syncfusion.DocIORenderer;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.OrdSyncfusionExtend.Queries
{
    public class SyncfusionWordToFileDtoQuery : IRequest<FileDto>
    {
        private string FileName;
        private WordDocument Document;
        private string MimeTypeName;

        public SyncfusionWordToFileDtoQuery(WordDocument document, string fileName, string mimeTypeName)
        {
            FileName = fileName;
            Document = document;
            MimeTypeName = mimeTypeName;
        }
        private class Handler : IRequestHandler<SyncfusionWordToFileDtoQuery, FileDto>
        {
            private readonly IOrdAppFactory _factory;

            public Handler(IOrdAppFactory factory)
            {
                _factory = factory;
            }

            public async Task<FileDto> Handle(SyncfusionWordToFileDtoQuery request, CancellationToken cancellationToken)
            {
                FormatFileBeforeSaving(request.Document);
                var outputFile = new FileDto(request.FileName, MimeTypeNames.ApplicationPdf);
                await using var outputStream = new MemoryStream();
                switch (request.MimeTypeName)
                {
                    case MimeTypeNames.ApplicationPdf:
                        {
                            using var render = new DocIORenderer();
                            using var pdfDocument = render.ConvertToPDF(request.Document);
                            pdfDocument.Save(outputStream);
                            pdfDocument.Close();
                            break;
                        }
                    case MimeTypeNames.ApplicationMsword:
                        {
                            request.Document.Save(outputStream, FormatType.Docx);
                            outputStream.Position = 0;
                            break;
                        }
                }
                await _factory.TempFileCacheManager.SetFileAsync(outputFile, outputStream.ToArray());
                outputStream.SetLength(0);
                request.Document.Close();
                request.Document.Dispose();
                return outputFile;
            }

            private void FormatFileBeforeSaving(WordDocument doc)
            {
                FileHelper.RemoveEmtyPage(doc);
            }
        }
    }
}
