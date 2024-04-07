import { AbstractControl } from '@angular/forms';

export function validCMND(c: AbstractControl) {
  const v = c.value;
  const regex_CMND: RegExp = /^[0-9]{9}$/;
  const regex_CCCD: RegExp = /^[0-9]{12}$/;
  if (v) {
    if (regex_CMND.test(v) === false && regex_CCCD.test(v) === false) {
      return {
        cmndKhongHopLe: true,
      };
    }
    return;
  }
  return;
}
