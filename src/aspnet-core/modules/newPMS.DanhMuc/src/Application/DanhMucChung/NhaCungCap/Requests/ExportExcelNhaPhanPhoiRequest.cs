using FlexCel.Report;
using FlexCel.XlsAdapter;
using MediatR;
using OrdBaseApplication;
using OrdBaseApplication.DataExporting;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Requests
{
    public class ExportExcelNhaCungCapRequest : IRequest<FileDto>
    {
        public PagingNhaCungCapRequest FilterInput { get; set; }
    }

    public class ExportExcelNhaCungCapHandler : AppBusinessBase, IRequestHandler<ExportExcelNhaCungCapRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public ExportExcelNhaCungCapHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(ExportExcelNhaCungCapRequest request, CancellationToken cancellationToken)
        {
            var SampleFileFolder = "sampleFiles/flex-cel/danh-muc/nha-cung-cap/";
            var SampleFile = "ExportNhaCungCap.xlsx";
            var OutputFileNameNotExtension = "NhaCungCap";

            request.FilterInput.SkipCount = 0;
            request.FilterInput.MaxResultCount = int.MaxValue;

            try
            {
                var path = Path.Combine(_factory.HostingEnvironment.WebRootPath
                    ,SampleFileFolder,
                    SampleFile);
                var resultXls = new XlsFile(true);
                resultXls.Open(path);
                using(var fr = new FlexCelReport())
                {
                    var dataMap = await _factory.Mediator.Send(request.FilterInput);
                    var tmp = dataMap.Items.ToList();
                    fr.AddTable("tbData", tmp);
                    fr.Run(resultXls);
                    fr.Dispose();
                }
                return await _factory.Mediator.Send(new XlsFileToExcelFileDtoRequest
                {
                    XlsResult = resultXls,
                    OutputFileNameNotExtension = OutputFileNameNotExtension,
                    IsFileExcel2003 = false
                }, cancellationToken);

            }catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
