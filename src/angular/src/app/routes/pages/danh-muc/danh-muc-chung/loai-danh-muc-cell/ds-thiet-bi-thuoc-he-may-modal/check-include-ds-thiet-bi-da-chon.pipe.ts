import { Pipe, PipeTransform } from '@angular/core';
import { CodeSystemDto } from '@app/shared/service-proxies/danh-muc-service-proxies';
@Pipe({
  name: 'checkIncludeDsThietBiDaChon',
})
export class CheckIncludeDsThietBiDaChonPipe implements PipeTransform {
  transform(listThietBi: CodeSystemDto[], id: number): boolean {
    return !!listThietBi.find((x) => x.id === id);
  }
}
