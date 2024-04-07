import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showColumn'
})
export class ShowColumnPipe implements PipeTransform {

  transform(idxColumn: number, showBtnSelectColums: boolean = false, columnsToDisplay: number[] = []): boolean {
    if (showBtnSelectColums) {
      return columnsToDisplay.indexOf(idxColumn) > -1;
    }
    return true;
  }

}
