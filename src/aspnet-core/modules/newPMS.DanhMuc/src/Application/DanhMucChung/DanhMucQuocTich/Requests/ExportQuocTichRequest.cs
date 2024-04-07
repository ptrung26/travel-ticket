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

namespace newPMS.DanhMuc.Dtos
{
    public class ExportQuocTichRequest : IRequest<FileDto>
    {
        public PagingQuocTichRequest FilterInput { get; set; }
    }

    public class ExportQuocTichHandler : IRequestHandler<ExportQuocTichRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public ExportQuocTichHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(ExportQuocTichRequest request, CancellationToken cancellationToken)
        {
            var SampleFileFolder = "sampleFiles/flex-cel/danh-muc/dia-chinh/quoc-tich/";
            var SampleFile = "ExportQuocTich.xlsx";
            var OutputFileNameNotExtension = "QuocTich";

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