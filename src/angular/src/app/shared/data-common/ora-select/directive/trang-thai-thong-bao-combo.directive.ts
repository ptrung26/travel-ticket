import { Directive } from '@angular/core';
import { Observable, of } from '@node_modules/rxjs';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
  selector: '[dirTrangThaiThongBao]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: TrangThaiThongBaoComboDirective,
    },
  ],
})
export class TrangThaiThongBaoComboDirective implements ISelectOptions {
  options$ = of<ISelectOption[]>([]);

  constructor() {
    this.options$ = this.getDataSourceFromServer();
  }

  getDataSourceFromServer(): Observable<ISelectOption[]> {
    return of<ISelectOption[]>([
      { value: null, displayText: 'Tất cả' },
      { value: false, displayText: 'Chưa đọc' },
      { value: true, displayText: 'Đã đọc' },
    ]);
  }
}
