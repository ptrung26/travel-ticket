using System;

namespace OrdBaseApplication.Helper
{
    public static class NumericHelper
    {
        /// <summary>
        /// Lấy phần nguyên của phép chia
        /// </summary>
        /// <param name="divideNumber">Số chia</param>
        /// <param name="divisorNumber">Số bị chia</param>
        /// <param name="isOnlyGetInteger">Chỉ lấy phần nguyên</param>
        /// <returns></returns>
        public static int GetIntegerBetweenDecimal(decimal divideNumber, decimal? divisorNumber, bool isOnlyGetInteger = false)
        {
            if (divisorNumber == 0 || divisorNumber == null)
                return 0;
            decimal value = divideNumber / divisorNumber.Value;
            int integer = (int)value;

            /// Chỉ lấy phần nguyên
            if (isOnlyGetInteger == true)
                return integer;

            if (value > integer)
                return integer + 1;
            else
                return integer;
        }

        /// <summary>
        /// Lấy phần dư nguyên của phép chia
        /// </summary>
        /// <param name="divideNumber">Số chia</param>
        /// <param name="divisorNumber">Số bị chia</param>
        /// <param name="isOnlyGetInteger">Chỉ lấy phần nguyên</param>
        /// <returns></returns>
        public static int GetRemainderBetweenDecimal(decimal divideNumber, decimal? divisorNumber, bool isOnlyGetInteger = false)
        {
            if (divisorNumber == 0 || divisorNumber == null)
                return 0;
            decimal value = divideNumber % divisorNumber.Value;
            int integer = (int)value;

            /// Chỉ lấy phần nguyên
            if (isOnlyGetInteger == true)
                return integer;

            if (value > integer)
                return integer + 1;
            else
                return integer;
        }

        public static Guid ToGuid(long value)
        {
            byte[] guidData = new byte[16];
            Array.Copy(BitConverter.GetBytes(value), guidData, 8);
            return new Guid(guidData);
        }

        public static string ToOrdinalString(this int number)
        {
            // Numbers in the teens always end with "th"

            if ((number % 100 > 10 && number % 100 < 20))
                return number + "th";
            else
            {
                // Check remainder

                switch (number % 10)
                {
                    case 1:
                        return number + "st";

                    case 2:
                        return number + "nd";

                    case 3:
                        return number + "rd";

                    default:
                        return number + "th";
                }
            }
        }
    }
}
