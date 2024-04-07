using Abp.AspNetZeroCore.Net;
using Syncfusion.DocIO.DLS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Shared.Utils
{
    public class FileHelper
    {
        private volatile static FileHelper instance; //volatile để tránh đụng độ thred
        private static object key = new object();
        public static FileHelper Instance
        {
            get
            {
                if (instance == null)
                    lock (key)
                    {
                        instance = new FileHelper();

                    }
                return instance;
            }
        }
        private FileHelper() { }

        private const string XlsxFormat = "xlsx";
        private const string CsvFormat = "csv";
        private const string TxtFormat = "txt";
        private const string PdfFormat = "pdf";

        public string GetExtentionFile(string ext)
        {
            switch (ext)
            {
                case "pdf":
                    return MimeTypeNames.ApplicationPdf;
                case "doc":
                    return MimeTypeNames.ApplicationMsword;
                case "docx":
                    return MimeTypeNames.ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument;
                case "xls":
                    return MimeTypeNames.ApplicationVndMsExcel;
                case "xlsx":
                    return MimeTypeNames.ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet;
                default:
                    return "";
            }
        }

        public static string NumberToText(double inputNumber, bool suffix = true)
        {
            string[] unitNumbers = new string[] { "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín" };
            string[] placeValues = new string[] { "", "nghìn", "triệu", "tỷ" };
            bool isNegative = false;
            string sNumber = inputNumber.ToString("#");
            double number = Convert.ToDouble(sNumber);

            if (number == 0)
            {
                return "Không đồng";
            }

            if (number < 0)
            {
                number = -number;
                sNumber = number.ToString();
                isNegative = true;
            }
            int ones, tens, hundreds;
            int positionDigit = sNumber.Length;
            string result = " ";
            if (positionDigit == 0)
                result = unitNumbers[0] + result;
            else
            {
                int placeValue = 0;
                while (positionDigit > 0)
                {
                    tens = hundreds = -1;
                    ones = Convert.ToInt32(sNumber.Substring(positionDigit - 1, 1));
                    positionDigit--;
                    if (positionDigit > 0)
                    {
                        tens = Convert.ToInt32(sNumber.Substring(positionDigit - 1, 1));
                        positionDigit--;
                        if (positionDigit > 0)
                        {
                            hundreds = Convert.ToInt32(sNumber.Substring(positionDigit - 1, 1));
                            positionDigit--;
                        }
                    }
                    if ((ones > 0) || (tens > 0) || (hundreds > 0) || (placeValue == 3))
                        result = placeValues[placeValue] + result;
                    placeValue++;
                    if (placeValue > 3) placeValue = 1;
                    if ((ones == 1) && (tens > 1))
                        result = "một " + result;
                    else
                    {
                        if ((ones == 5) && (tens > 0))
                            result = "lăm " + result;
                        else if (ones > 0)
                            result = unitNumbers[ones] + " " + result;
                    }
                    if (tens < 0)
                        break;
                    else
                    {
                        if ((tens == 0) && (ones > 0)) result = "lẻ " + result;
                        if (tens == 1) result = "mười " + result;
                        if (tens > 1) result = unitNumbers[tens] + " mươi " + result;
                    }
                    if (hundreds < 0) break;
                    else
                    {
                        if ((hundreds > 0) || (tens > 0) || (ones > 0))
                            result = unitNumbers[hundreds] + " trăm " + result;
                    }
                    result = " " + result;
                }
            }
            result = result.Trim();
            if (isNegative) result = "Âm " + result;
            return result + (suffix ? " đồng chẵn" : "");
        }

        //Iterates from last section in document. 
        public static void RemoveEmtyPage(WordDocument document)
        {
            for (int secIndex = document.Sections.Count - 1; secIndex >= 0; secIndex--)
            {
                //Iterates textbody from section.
                for (int i = document.Sections[secIndex].ChildEntities.Count - 1; i >= 0; i--)
                {
                    WTextBody textBody = document.Sections[secIndex].ChildEntities[i] as WTextBody;

                    //Iterate to the main body.
                    if (textBody.EntityType == EntityType.TextBody)
                    {
                        //Removes empty items in the body.
                        RemoveEmptyItems(textBody);

                        //Removes empty section.
                        if (textBody.ChildEntities.Count == 0)
                        {
                            document.Sections.RemoveAt(secIndex);
                            break;
                        }
                    }
                }

            }
        }

        public static void RemoveEmptyItems(WTextBody textBody)
        {
            //Iterates textbody items.
            for (int itemIndex = textBody.ChildEntities.Count - 1; itemIndex >= 0; itemIndex--)
            {
                #region Removes empty paragraph
                //Checks item is empty paragraph and removes it.
                if (textBody.ChildEntities[itemIndex] is WParagraph)
                {
                    WParagraph paragraph = textBody.ChildEntities[itemIndex] as WParagraph;
                    bool hasonlyBookmarks = true;

                    for (int pIndex = paragraph.Items.Count - 1; pIndex >= 0; pIndex--)
                    {
                        ParagraphItem paragraphItem = paragraph.Items[pIndex];

                        //Checks paragraph contains any items.
                        if (!(paragraphItem is BookmarkStart || paragraphItem is BookmarkEnd))
                        {
                            hasonlyBookmarks = false;
                            break;
                        }
                    }

                    //Remove the empty paragraph.
                    if (paragraph.Items.Count == 0 || hasonlyBookmarks)
                        textBody.ChildEntities.RemoveAt(itemIndex);
                }
                #endregion


                else if (textBody.ChildEntities[itemIndex] is WTable)
                {
                    #region Removes headerline in table
                    WTable table = textBody.ChildEntities[itemIndex] as WTable;
                    //Iterate from last row of table.
                    for (int rowIndex = table.Rows.Count - 1; rowIndex >= 0; rowIndex--)
                    {
                        //Checks and removes empty row.
                        if (IsEmptyRow(table.Rows[rowIndex]))
                            table.Rows.RemoveAt(rowIndex);
                        //Skip if it reach non empty row.
                        else
                            break;
                    }
                    #endregion
                }

                //Other items in body.
                else
                    break;
            }
        }

        public static bool IsEmptyRow(WTableRow row)
        {

            //Iterate into cells and check it is empty row.
            for (int cellIndex = row.Cells.Count - 1; cellIndex >= 0; cellIndex--)
            {
                //Skip to remove row, if cell is not empty.
                if (!IsEmptyCell(row.Cells[cellIndex]))
                    return false;
            }
            return true;
        }
        /// <summary>
        /// Iterates to items in cell and checks it is empty cell.
        /// </summary>
        /// <param name="cell">Represents a table cell to check empty or not.</param>
        /// <returns>Returns true, if cell is empty.</returns>
        public static bool IsEmptyCell(WTableCell cell)
        {
            //Iterates items in cell.
            for (int itemIndex = 0; itemIndex < cell.ChildEntities.Count; itemIndex++)
            {
                //Checks item is empty paragraph.
                if (cell.ChildEntities[itemIndex] is WParagraph)
                {
                    WParagraph paragraph = cell.ChildEntities[itemIndex] as WParagraph;
                    for (int pIndex = paragraph.Items.Count - 1; pIndex >= 0; pIndex--)
                    {
                        ParagraphItem paragraphItem = paragraph.Items[pIndex];
                        //Check paragraph contains bookmark only.
                        //Otherwise it is not empty. Here, page break also identified as one of paragraphitem.
                        if (!(paragraphItem is BookmarkStart || paragraphItem is BookmarkEnd))
                            return false;
                    }
                }

                //Other items in cell.
                else
                    return false;
            }
            return true;
        }

        /// <summary>
        /// Checkc whether the bookmark contains renderable items.
        /// </summary>
        /// <param name="paragraph"></param>
        /// <returns></returns>
        public static bool IsEmptyParagraph(WParagraph paragraph)
        {

            return true;
        }

        public static void RemoveEmptyParagrapCustom(TextSelection[] Array)
        {
            foreach (TextSelection selection in Array)
            {
                WTextRange textRange = selection.GetAsOneRange();
                WTextBody ownerTextBody = textRange.OwnerParagraph.OwnerTextBody;
                if (ownerTextBody != null)
                    ownerTextBody.ChildEntities.Remove(textRange.OwnerParagraph);
            }
        }

        public static void RemoveRowEmptyTable(TextSelection[] selectionArray)
        {
            foreach (TextSelection selection in selectionArray)
            {
                WParagraph paraCT = selection.GetAsOneRange().OwnerParagraph;
                if (paraCT.Owner.EntityType == EntityType.TableCell)
                {
                    WTableCell cell = paraCT.Owner as WTableCell;
                    int index = cell.OwnerRow.GetRowIndex();
                    WTable table = cell.OwnerRow.Owner as WTable;
                    table.ChildEntities.Remove(cell.OwnerRow);
                }
            }
        }

        public static bool IsNumeric(string value)
        {
            try
            {
                if (value == null)
                {
                    return false;
                };

                char[] chars = value.ToCharArray();
                foreach (char c in chars)
                {
                    if (!char.IsNumber(c))
                        return false;
                }
                return true;
            }
            catch (Exception ex) { return false; }
        }

        //Viết hoa chữ cái đầu câu
        public static string makeFirstLetter(string s)
        {
            if (!string.IsNullOrEmpty(s) && s.Trim() != "")
            {
                return s.Remove(0, 1).Insert(0, s[0].ToString().ToUpper());
            }
            return s;
        }

        public static string ConvertToSoLaMa(int number)
        {
            var result = "";
            string[] ArrLama = { "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" };
            int[] ArrNumber = { 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 };
            var flag = true;
            int i = 0;
            while (flag)
            {
                while (number >= ArrNumber[i])
                {
                    number -= ArrNumber[i];
                    result += ArrLama[i];
                    if (number < 1)
                        flag = false;
                }
                i++;
            }
            return result;
        }
    }
}
