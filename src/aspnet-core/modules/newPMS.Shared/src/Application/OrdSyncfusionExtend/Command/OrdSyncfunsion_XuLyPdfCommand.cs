using MediatR;
using newPMS.Shared.Utils;
using OrdBaseApplication.Factory;
using Syncfusion.Pdf.Graphics;
using Syncfusion.Pdf.Parsing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.OrdSyncfusionExtend.Command
{
    /// <summary>
    /// Trả về đường dẫn file pdf sau khi xử lý
    /// </summary>
    public class OrdSyncfunsion_XuLyPdfCommand : IRequest<string>
    {
        private string TemplateFilePath;
        private string OutputFilePath;
        public Func<PdfLoadedDocument, Handler, Task> XuLyPdfAsync { get; set; }
        public List<OrdSyncfunsionXuLyPdfReplaceText> ListReplaceText { get; set; }

        public OrdSyncfunsion_XuLyPdfCommand(string templateFilePath, string outputFilePath)
        {
            TemplateFilePath = templateFilePath;
            OutputFilePath = outputFilePath;
            ListReplaceText = new List<OrdSyncfunsionXuLyPdfReplaceText>();
        }

        public class Handler : IRequestHandler<OrdSyncfunsion_XuLyPdfCommand, string>
        {
            private readonly IOrdAppFactory _factory;
            private Dictionary<string, PdfTrueTypeFont> _dicFont;
      

            public Handler(IOrdAppFactory factory)
            {
                _factory = factory;
                _dicFont = new Dictionary<string, PdfTrueTypeFont>();
            }

            public async Task<string> Handle(OrdSyncfunsion_XuLyPdfCommand request, CancellationToken cancellationToken)
            {
                // mở file mẫu
                await using var fileStream = new FileStream(request.TemplateFilePath, FileMode.Open, FileAccess.Read);
                using var loadedDocument = new PdfLoadedDocument(fileStream);

                #region Xử lý pdf
                if (request.XuLyPdfAsync != null)
                {
                    await request.XuLyPdfAsync.Invoke(loadedDocument, this);
                }
                ReplaceTextDocument(loadedDocument, request.ListReplaceText);
                #endregion

                // lưu file
                await using var outputFileStream = new FileStream(request.OutputFilePath, FileMode.Append);
                loadedDocument.Save(outputFileStream);
                outputFileStream.Close();
                loadedDocument.Close(true);
                fileStream.Close();
                if (_dicFont.Count > 0)
                {
                    foreach (var item in _dicFont)
                    {
                        item.Value.Dispose();
                    }
                    _dicFont.Clear();
                    _dicFont = null;
                }
                return request.OutputFilePath;
            }
            protected PdfTrueTypeFont GetPdfTrueTypeFont(string fontName, int fontSize)
            {
                if (_dicFont.ContainsKey(fontName))
                {
                    return _dicFont[fontName];
                }
                var hostPath = _factory.HostingEnvironment.WebRootPath;
                var fontPath = Path.Combine(hostPath, fontName);
                _dicFont[fontName] = new PdfTrueTypeFont(fontPath, fontSize);
                return _dicFont[fontName];
            }

            private void ReplaceTextDocument(PdfLoadedDocument loadedDocument, List<OrdSyncfunsionXuLyPdfReplaceText> listReplaceText)
            {
                if (listReplaceText?.Any() == true && loadedDocument.Pages.Count > 0)
                {
                    for (var pageIndex = 0; pageIndex < loadedDocument.Pages.Count; pageIndex++)
                    {
                        foreach (var replaceTextDto in listReplaceText)
                        {
                            loadedDocument.FindText(replaceTextDto.Key, pageIndex, out var matchedTextbounds);
                            if (matchedTextbounds?.Any() == true)
                            {
                                foreach (var rectangle in matchedTextbounds)
                                {
                                    switch (replaceTextDto.Type)
                                    {
                                        case OrdSyncfunsionXuLyPdfReplaceText.FontType.FontTimesNewRoman:
                                            ReplaceText_WithFont(replaceTextDto, GetPdfTrueTypeFont(FontNameConst.FontTimesNewRoman, 13), rectangle, loadedDocument.Pages[pageIndex]);
                                            break;
                                        case OrdSyncfunsionXuLyPdfReplaceText.FontType.FontTimesNewRomanBold:
                                            ReplaceText_WithFont(replaceTextDto, GetPdfTrueTypeFont(FontNameConst.FontTimesNewRomanBold, 14), rectangle, loadedDocument.Pages[pageIndex]);
                                            break;
                                        case OrdSyncfunsionXuLyPdfReplaceText.FontType.FontTimesNewRomanItalic:
                                            ReplaceText_WithFont(replaceTextDto, GetPdfTrueTypeFont(FontNameConst.FontTimesNewRomanItalic, 13), rectangle, loadedDocument.Pages[pageIndex]);
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            private void ReplaceText_WithFont(OrdSyncfunsionXuLyPdfReplaceText replaceTextDto, PdfTrueTypeFont font, Syncfusion.Drawing.RectangleF rectangle, Syncfusion.Pdf.PdfPageBase page)
            {
                page.Graphics.DrawRectangle(PdfBrushes.Transparent, rectangle);
                if (replaceTextDto.Type == OrdSyncfunsionXuLyPdfReplaceText.FontType.FontTimesNewRoman)
                {
                    if (replaceTextDto.Center)
                    {
                        page.Graphics.DrawString(replaceTextDto.Replace, font, PdfBrushes.MidnightBlue, rectangle.Left + (rectangle.Width / 2) - ((rectangle.Width / replaceTextDto.Key.Length - 1.3f) * replaceTextDto.Replace.Length) / 2, rectangle.Y - rectangle.Height / 2 + 1);
                    }
                    else
                    {
                        page.Graphics.DrawString(replaceTextDto.Replace, font, PdfBrushes.MidnightBlue, rectangle.X - 2, rectangle.Y - rectangle.Height / 2);
                    }
                }
                if (replaceTextDto.Type == OrdSyncfunsionXuLyPdfReplaceText.FontType.FontTimesNewRomanBold)
                {
                    if (replaceTextDto.Center)
                    {
                        page.Graphics.DrawString(replaceTextDto.Replace, font, PdfBrushes.MidnightBlue, rectangle.Left + (rectangle.Width / 2) - ((rectangle.Width / replaceTextDto.Key.Length - 1.3f) * replaceTextDto.Replace.Length) / 2, rectangle.Y - rectangle.Height / 2 + 2);
                    }
                    else
                    {
                        page.Graphics.DrawString(replaceTextDto.Replace, font, PdfBrushes.MidnightBlue, rectangle.X - 2, rectangle.Y - rectangle.Height / 2 + 2);
                    }
                }
                if (replaceTextDto.Type == OrdSyncfunsionXuLyPdfReplaceText.FontType.FontTimesNewRomanItalic)
                {
                    if (replaceTextDto.Center)
                    {
                        page.Graphics.DrawString(replaceTextDto.Replace, font, PdfBrushes.MidnightBlue, rectangle.Left + (rectangle.Width / 2) - ((rectangle.Width / replaceTextDto.Key.Length - 1.3f) * replaceTextDto.Replace.Length) / 2, rectangle.Y - rectangle.Height / 2 + 2);
                    }
                    else
                    {
                        page.Graphics.DrawString(replaceTextDto.Replace, font, PdfBrushes.MidnightBlue, rectangle.X - 2, rectangle.Y - rectangle.Height / 2);
                    }
                }
            }
        }
    }

    public class OrdSyncfunsionXuLyPdfReplaceText
    {
        public string Key { get; set; }
        public string Replace { get; set; }
        public bool Center { get; set; }
        public FontType Type { get; set; }
        public enum FontType
        {
            FontTimesNewRomanBold = 1,
            FontTimesNewRoman = 2,
            FontTimesNewRomanItalic = 3
        }
        public OrdSyncfunsionXuLyPdfReplaceText(string key, string replace, FontType type)
        {
            Key = key;
            Replace = replace;
            Type = type;
            Center = true;
        }
    }
}
