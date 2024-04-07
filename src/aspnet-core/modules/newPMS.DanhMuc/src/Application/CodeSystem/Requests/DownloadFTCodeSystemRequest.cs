using FlexCel.Report;
using FlexCel.XlsAdapter;
using MediatR;
using OrdBaseApplication.DataExporting;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Requests
{
    public class DownloadFTCodeSystemRequest : IRequest<FileDto>
    {
        public string Display { get; set; }
    }

    public class DownloadFTCodeSystemRequestHandler : IRequestHandler<DownloadFTCodeSystemRequest, FileDto>
    {
        private readonly IOrdAppFactory _factory;

        public DownloadFTCodeSystemRequestHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<FileDto> Handle(DownloadFTCodeSystemRequest request, CancellationToken cancellationToken)
        {
            var SampleFileFolder = "sampleFiles/flex-cel/danh-muc/danh-muc-chung/";

            var SampleFile = "danh-muc-model.xlsx";
            var OutputFileNameNotExtension = "Danh Mục " + request.Display;

            try
            {
                var path = Path.Combine(_factory.HostingEnvironment.WebRootPath,
                    SampleFileFolder,
                    SampleFile);
                var resultXls = new XlsFile(true);
                resultXls.Open(path);
                using (var fr = new FlexCelReport())
                {
                    fr.SetValue("LoaiDanhMuc", request.Display);
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