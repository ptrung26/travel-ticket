import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';

@Pipe({
  name: 'oraSearchFilterList',
})
export class OraSearchFilterListPipe implements PipeTransform {
  transform(arr: any, searchTxt: string): any {
    if (!arr || !searchTxt) {
      return arr;
    }
    //return updated animals array
    let _arr = _.filter(arr, (s) => {
      const ftsVietTat = AppUtilityService.searchVietTat(s.tenHocVien);
      const checkVietTat = ftsVietTat.indexOf(searchTxt) > -1;
      const ftsRemoveDau = AppUtilityService.removeDau(s.tenHocVien);
      const checkRemoveDau = ftsRemoveDau.indexOf(AppUtilityService.removeDau(searchTxt)) > -1;
      if (AppUtilityService.isNullOrEmpty(s.fts)) {
        s.fts = AppUtilityService.getFullTextSearch(s.tenHocVien);
      }
      return s.fts.indexOf(searchTxt) > -1 || checkVietTat || checkRemoveDau;
    });
    return _arr;
  }
}
