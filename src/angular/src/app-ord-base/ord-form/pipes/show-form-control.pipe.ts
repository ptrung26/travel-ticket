import { Pipe, PipeTransform } from '@angular/core';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { OrdFormItem } from '../dynamic-form/dynamic-form-page.component';

@Pipe({
  name: 'showFormControl',
  pure: false
})
export class ShowFormControlPipe implements PipeTransform {
  transform(dataForm: any, control: OrdFormItem): boolean {
    if (AppUtilityService.isNullOrEmpty(control?.funcShow)) {
      return true;
    }
    if (AppUtilityService.isNullOrEmpty(dataForm)) {
      return true;
    }
    return control.funcShow(dataForm);
  }
}
