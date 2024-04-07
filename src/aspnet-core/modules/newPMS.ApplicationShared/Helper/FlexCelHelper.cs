using FlexCel.Report;
using FlexCel.Core;
using FlexCel.XlsAdapter;

namespace newPMS.ApplicationShared.Helper
{
    public static class FlexCelHelper
    {
        public static void FillSoTheBaoHiem(this FlexCelReport fr, string soThe)
        {
            fr.SetValue("Cot1", "");
            fr.SetValue("Cot2", "");
            fr.SetValue("Cot3", "");
            fr.SetValue("Cot4", "");
            fr.SetValue("Cot5", "");
            fr.SetValue("Cot6", "");
            if (string.IsNullOrEmpty(soThe))
            {
                return;
            }
            try
            {
                fr.SetValue("Cot1", soThe.Substring(0, 2));
                fr.SetValue("Cot2", soThe.Substring(2, 1));
                fr.SetValue("Cot3", soThe.Substring(3, 2));
                fr.SetValue("Cot4", soThe.Substring(5, 2));
                fr.SetValue("Cot5", soThe.Substring(7, 3));
                fr.SetValue("Cot6", soThe.Substring(10, 5));
            }
            catch
            {
                // ignored
            }
        }

        /// <summary>
        /// CreateCell
        /// </summary>
        /// <param name="xls"></param>
        /// <param name="row"></param>
        /// <param name="column"></param>
        /// <param name="value"></param>
        /// <param name="autofitRow"></param>
        /// <param name="tformat"></param>
        /// <param name="formula"></param>
        public static void CreateCell(XlsFile xls, int row, int column, object value,            
             TFlxFormat tformat = null,
              bool autofitRow = true,
             string formula = "")
        {
            xls.SetCellValue(row, column, value);
            xls.SetAutoRowHeight(row, true);

            if (autofitRow)
            {
                xls.AutofitRow(row, true, 1.3);
            }

            if (tformat != null)
            {
                xls.SetCellFormat(row, column, xls.AddFormat(tformat));
            }

            if (!string.IsNullOrEmpty(formula))
            {
                xls.SetCellValue(row, column, new TFormula(formula));
            }
        }

        /// <summary>
        /// MergeCells
        /// </summary>
        /// <param name="xls"></param>
        /// <param name="fromRow"></param>
        /// <param name="fromColumn"></param>
        /// <param name="toRow"></param>
        /// <param name="toColumn"></param>
        /// <param name="value"></param>
        /// <param name="tformat"></param>
        /// <param name="formula"></param>
        public static void CreateCell(XlsFile xls, int fromRow, int fromColumn, int toRow, int toColumn, object value,
             TFlxFormat tformat = null, string formula = "")
        {
            xls.MergeCells(fromRow, fromColumn, toRow, toColumn);
            xls.SetCellValue(fromRow, fromColumn, value);

            if (tformat != null)
            {
                xls.SetCellFormat(fromRow, fromColumn, toRow, toColumn, xls.AddFormat(tformat));
            }

            if (!string.IsNullOrEmpty(formula))
            {
                xls.SetCellValue(fromRow, fromColumn, new TFormula(formula));
            }
        }

        /// <summary>
        /// CreateTFormat
        /// </summary>
        /// <param name="xls"></param>
        /// <param name="row"></param>
        /// <param name="column"></param>
        /// <param name="excelHorizontalAlignment"></param>
        /// <param name="excelVerticalAlignment"></param>
        /// <param name="fontStyle"></param>
        /// <param name="fontName"></param>
        /// <param name="fontSize"></param>
        /// <param name="warpText"></param>
        /// <param name="isBorder"></param>
        /// <returns></returns>
        public static TFlxFormat CreateTFormat(XlsFile xls, int row, int column,
           THFlxAlignment excelHorizontalAlignment = THFlxAlignment.left,
           TVFlxAlignment excelVerticalAlignment = TVFlxAlignment.center,
           TFlxFontStyles fontStyle = TFlxFontStyles.None,
            string fontName = "Times New Roman",
            int fontSize = 220,
            bool warpText = true,
            bool isBorder = true)
        {
            var fmt = xls.GetFormat(xls.GetCellFormat(row, column));
            fmt.HAlignment = excelHorizontalAlignment;
            fmt.VAlignment = excelVerticalAlignment;

            fmt.Font.Family = 1;
            //fmt.Font.Name = fontName;
            fmt.Font.Style = fontStyle;
            fmt.Font.Size20 = fontSize;
            fmt.WrapText = warpText;
            fmt.Font.Color = TExcelColor.FromArgb(0, 0, 0);

            if (isBorder)
            {
                fmt.Borders.SetAllBorders(TFlxBorderStyle.Thin, TExcelColor.FromArgb(0, 0, 0));
            }

            return fmt;
        }
    }
}
