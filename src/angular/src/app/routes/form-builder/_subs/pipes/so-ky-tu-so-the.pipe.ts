import { Pipe, PipeTransform } from '@angular/core';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Pipe({
  name: 'soKyTuSoThe'
})
export class SoKyTuSoThePipe implements PipeTransform {

  transform(value: string): unknown {
    if (AppUtilityService.isNullOrEmpty(value)) {
      return 0;
    }
    const v = value.replace(/\|/g, '').replace(/_/g, '');
    return v.length;
  }

}
