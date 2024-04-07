import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elementIdControl'
})
export class ElementIdControlPipe implements PipeTransform {

  transform(dataField: string, keyControlElementId: unknown): string {
    return `${keyControlElementId}_${dataField}`;
  }

}
