using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.OrdSyncfusionExtend.Queries;
using newPMS.Shared.Utils;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.OrdSyncfusionExtend.Command
{
    public class OrdSyncfusion_ExportWordFromTemplateCommand : IRequest<FileDto>
    {
        public string SampleFileFolder;
        public string SampleFile;
        public bool IsSetDefaultFontSize = true;
        public string OutputFileName;
        public string OutputMimeTypeName;
        public Func<WordDocument, Handler, Task> XuLyWordAsync;
        public class Handler : IRequestHandler<OrdSyncfusion_ExportWordFromTemplateCommand, FileDto>
        {
            private readonly IOrdAppFactory _appFactory;
            private WordDocument _wordDocument;
            public Handler(IOrdAppFactory appFactory)
            {
                _appFactory = appFactory;
            }

            public async Task<FileDto> Handle(OrdSyncfusion_ExportWordFromTemplateCommand request, CancellationToken cancellationToken)
            {
                var path = System.IO.Path.Combine(_appFactory.HostingEnvironment.WebRootPath, request.SampleFileFolder, request.SampleFile);
                await using var fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                _wordDocument = new WordDocument(fileStreamPath, FormatType.Automatic);
                fileStreamPath.Close();
                await fileStreamPath.DisposeAsync();
                var style = _wordDocument.AddParagraphStyle("Style_of_me");
                if (request.IsSetDefaultFontSize)
                {
                    style.CharacterFormat.FontSize = 14;
                    style.CharacterFormat.FontName = "Times New Roman";
                }
                if (request.XuLyWordAsync != null)
                {
                    await request.XuLyWordAsync(_wordDocument, this).ConfigureAwait(false);
                }
                var ret = await _appFactory.Mediator.Send(new SyncfusionWordToFileDtoQuery(
                   _wordDocument,
                    request.OutputFileName,
                   request.OutputMimeTypeName
                ), cancellationToken);
                try
                {
                    _wordDocument.Close();
                    _wordDocument.Dispose();
                }
                catch
                {
                    return ret;
                }
                return ret;
            }

            public void AddReplaceText(string given, string replace)
            {
                _wordDocument.Replace(given, replace, true, true);
            }
            public void RemoveEmptyParagrap(params string[] givens)
            {
                if (givens.Length > 0)
                {
                    for (int i = 0; i < givens.Length; i++)
                    {
                        var selections = _wordDocument.FindAll(givens[i], false, false);
                        if (selections?.Any() == true)
                        {
                            FileHelper.RemoveEmptyParagrapCustom(selections);
                        }
                    }
                }
            }
            public void RemoveRowEmptyTable(params string[] givens)
            {
                if (givens.Length > 0)
                {
                    for (int i = 0; i < givens.Length; i++)
                    {
                        var selections = _wordDocument.FindAll(givens[i], false, false);
                        if (selections?.Any() == true)
                        {
                            FileHelper.RemoveRowEmptyTable(selections);
                        }
                    }
                }
            }

            public void AddTextBodyPart(string findText, List<string> givens)
            {
                if (givens?.Count > 0)
                {
                    IWSection section = _wordDocument.AddSection();
                    IWParagraph paragraph = section.AddParagraph();
                    for (int i = 0; i < givens.Count; i++)
                    {
                        paragraph.AppendText(givens[i]);
                    }
                    TextBodyPart textBodyPart = new TextBodyPart(_wordDocument);
                    textBodyPart.BodyItems.Add(paragraph);
                    _wordDocument.Replace(findText, textBodyPart, false, true);
                }
            }

            public void FillNgayThangNam()
            {
                var today = DateTime.Now;
                AddReplaceText("[Ngay]", today.Day.ToString());
                AddReplaceText("[Thang]", today.Month.ToString());
                AddReplaceText("[Nam]", today.Year.ToString());
            }


        }
    }
}
