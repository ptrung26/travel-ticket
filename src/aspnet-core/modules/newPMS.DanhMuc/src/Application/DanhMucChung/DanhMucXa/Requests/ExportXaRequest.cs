using FlexCel.Report;
using FlexCel.XlsAdapter;
using MediatR;
using OrdBaseApplication.DataExporting;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Request
{
    public class ExportXaRequest : IRequest<FileDto>
    {
        public PagingXaRequest FilterInput { get; set; }
    }

    public class ExportXaHandler : IRequestHandler<ExportXaRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public ExportXaHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(ExportXaRequest request, CancellationToken cancellationToken)
        {
            var SampleFileFolder = "sampleFiles/flex-cel/danh-muc/dia-chinh/xa/";
            var SampleFile = "ExportXa.xlsx";
            var OutputFileNameNotExtension = "Xa";

            // filter
            request.FilterInput.SkipCount = 0;
            request.FilterInput.MaxResultCount = int.MaxValue;

            try
            {
                var path = Path.Combine(_factory.HostingEnvironment.WebRootPath,
                    SampleFileFolder,
                    SampleFile);
                var resultXls = new XlsFile(true);
                resultXls.Open(path);
                using (var fr = new FlexCelReport())
                {
                    // fetch data by paging
                    var dataMap = await _factory.Mediator.Send(request.FilterInput);
                    fr.AddTable("GridTableMain", dataMap.Items.ToList());
                    fr.Run(resultXls);
                    fr.Dispose();
                }

                return await _factory.Mediator.Send(new XlsFileToExcelFileDtoRequest
                {
                    XlsResult = resultXls,
                    OutputFileNameNotExtension = OutputFileNameNotExtension,
                    IsFileExcel2003 = false
                }, cancellationToken);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}