using FlexCel.Report;
using FlexCel.XlsAdapter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
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
    public class ExportExcelCodeSystemRequest : IRequest<FileDto>
    {
        public PagingCodeSystemRequests FilterInput { get; set; }
        public string? ParentCode { get; set; }
    }

    public class ExportExcelCodeSystemHandler : AppBusinessBase, IRequestHandler<ExportExcelCodeSystemRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public ExportExcelCodeSystemHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(ExportExcelCodeSystemRequest request, CancellationToken cancellationToken)
        {
            var codeSystems = Factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var codeST = codeSystems.FirstOrDefault(x => x.Code == request.ParentCode);

            var SampleFileFolder = "sampleFiles/flex-cel/danh-muc/danh-muc-chung/";

            var SampleFile = "danh-muc-export.xlsx";
            var OutputFileNameNotExtension = codeST != null ? ("Danh Mục " + codeST.Display) : ("Danh Mục");

            // filter
            request.FilterInput.SkipCount = 0;
            request.FilterInput.MaxResultCount = int.MaxValue;
            request.FilterInput.ParentCode = request.ParentCode;

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
                    fr.SetValue("LoaiDanhMuc", (codeST != null ? codeST.Display : ""));
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