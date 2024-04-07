using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
namespace newPSG.PMS
{
    public static partial class DataUtil
    {
        public static string GetMaxLoaiMa(List<string> arrInput = null, decimal? maxLength = 3, string TienTo = "")
        {
            List<int> arrConvertResult = new List<int>();
            foreach (var item in arrInput)
            {
                var charConvert = item.ToCharArray();
                var convertResult = 0;
                for (int i = 0; i < charConvert.Length; i++)
                {
                    var number = 0;
                    bool success = int.TryParse(charConvert[i].ToString(), out number);
                    if (success)
                    {
                        convertResult = convertResult * 10 + number;
                    }
                }
                arrConvertResult.Add(convertResult);
            }

            if (arrConvertResult.Count > 0)
            {
                return TienTo + (arrConvertResult.Max() + 1).ToString("D" + maxLength);
            }
            else
            {
                return TienTo + 1.ToString("D" + maxLength);
            }
        }

        public static string GetMaxLoaiMa2(List<string> arrInput = null, decimal? maxLength = 3, string TienTo = "")
        {
            List<int> arrConvertResult = new List<int>();
            foreach (var item in arrInput)
            {
                var check = item.Contains(TienTo);
                var convertResult = 0;
                if (check == true)
                {
                    var number = 0;
                    var strNum = item.Substring(TienTo.Length, item.Length - TienTo.Length);
                    bool success = int.TryParse(strNum, out number);
                    if (success)
                    {
                        convertResult = convertResult * 10 + number;
                    }
                }

                arrConvertResult.Add(convertResult);
            }

            if (arrConvertResult.Count > 0)
            {
                return TienTo + (arrConvertResult.Max() + 1).ToString("D" + maxLength);
            }
            else
            {
                return TienTo + 1.ToString("D" + maxLength);
            }
        }
    }
}
