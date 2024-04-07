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
    public class ExportDanhMucHuyenRequest : IRequest<FileDto>
    {
        public PagingDanhMucHuyenRequest FilterInput { get; set; }
    }

    public class ExportDanhMucHuyenHandler : IRequestHandler<ExportDanhMucHuyenRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public ExportDanhMucHuyenHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(ExportDanhMucHuyenRequest request, CancellationToken cancellationToken)
        {
            var SampleFileFolder = "sampleFiles/flex-cel/danh-muc/dia-chinh/huyen/";
            var SampleFile = "danh-muc-huyen-export.xlsx";
            var OutputFileNameNotExtension = "DanhMucHuyen";

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
                    var tmp = dataMap.Items.ToList();
                    fr.AddTable("GridTableMain", tmp);
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