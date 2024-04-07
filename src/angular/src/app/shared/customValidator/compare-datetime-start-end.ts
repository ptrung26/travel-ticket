import { DateTime } from 'luxon';
import { FormGroup, ValidatorFn } from '@angular/forms';

export function compareDatetimeStartEnd(ngayBatDau: DateTime, ngayKetThuc: DateTime): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } => {
    let errorMessage = 'DateTimeErrors';
    const ngayBatDau = group.controls.ngayBatDau;
    const ngayKetThuc = group.controls.ngayKetThuc;
    const isTrue = Date.parse(ngayBatDau.value) > Date.parse(ngayKetThuc.value);
    // set equal value error on dirty controls
    if (isTrue && ngayBatDau.valid && ngayKetThuc.valid) {
      ngayKetThuc.setErrors({ dateTimeErrors: errorMessage });
      const message = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!';
      return { dateTimeErrors: message };
    }
    if (!isTrue && ngayKetThuc.hasError('dateTimeErrors')) {
      ngayKetThuc.setErrors(null);
    }
    return null;
  };
}
