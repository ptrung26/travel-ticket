import { Pipe, PipeTransform } from '@angular/core';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Pipe({
  name: 'isSuccessSoThe'
})
export class IsSuccessSoThePipe implements PipeTransform {

  transform(value: string): boolean {
    if (AppUtilityService.isNullOrEmpty(value)) {
      return false;
    }
    const v = value.replace(/\|/g, '').replace(/_/g, '');
    return v.length === 15;
  }

}
