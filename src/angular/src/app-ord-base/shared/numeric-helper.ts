import * as _ from "lodash";

export class NumericHelper {

  /**
   * Lấy phần nguyên của phép chia
   * @param divideNumber Số chia
   * @param divisorNumber Số bị chia
   * @param isOnlyGetInteger Chỉ lấy phần nguyên
   */
  public static GetIntegerBetweenDecimal(divideNumber?: number, divisorNumber?, isOnlyGetInteger: boolean = false) {
    try {
      if (divisorNumber == 0 || divisorNumber == null)
        return 0;
      let value = divideNumber / divisorNumber;
      let integer = _.round((value), 0);

      /// Chỉ lấy phần nguyên
      if (isOnlyGetInteger == true)
        return integer;

      if (value > integer)
        return integer + 1;
      else
        return integer;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Lấy phần dư nguyên của phép chia
   * @param divideNumber Số chia
   * @param divisorNumber Số bị chia
   * @param isOnlyGetInteger Chỉ lấy phần nguyên
   */
  public static GetRemainderBetweenDecimal(divideNumber?: number, divisorNumber?, isOnlyGetInteger: boolean = false) {
    try {
      if (divisorNumber == 0 || divisorNumber == null)
        return 0;
      let value = divideNumber % divisorNumber;
      let integer = _.round((value), 0);

      /// Chỉ lấy phần nguyên
      if (isOnlyGetInteger == true)
        return integer;

      if (value > integer)
        return integer + 1;
      else
        return integer;
    } catch (e) {
      return 0;
    }
  }
}
