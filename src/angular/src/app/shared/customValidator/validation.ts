import { AbstractControl } from "@angular/forms";

export function phoneValidate(control: AbstractControl) {
  const value = control.value;
  const regex_SDT_Ban: RegExp =
    /^(\()?([0])?2((\d{2}(\)|\.)?(\ )?(\d)(\.)?(\d{3})(\.)?(\d{3}))|((4)|(8))(\)|\.)?(\ )?(\d{2})(\.)?(\d{3})(\.)?(\d{3}))$/;
  const regex_SDT_Dd: RegExp = /^([0])?(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
  if (value && regex_SDT_Dd.test(value) === false && regex_SDT_Ban.test(value) === false) {
    return { phoneInvalid: true };
  }
  return null;
}

export function bankAccValidate(control: AbstractControl) {
  const value = control.value;
  const regexBankAcc: RegExp = /^[0-9]*$/;
  if (value && regexBankAcc.test(value) === false) {
    return { bankAccInvalid: true };
  }
  return null;
}
