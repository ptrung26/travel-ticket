import { AbstractControl } from '@angular/forms';

export function validateNoSpace(control: AbstractControl) {
  if (control.value && !control.value.toString().trim().length) {
    return { whitespace: true };
  } else {
    return;
  }
}
