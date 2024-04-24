import { Directive, OnInit } from '@angular/core';
import { Observable, of } from '@node_modules/rxjs';
import { SessionKey } from '@sessionKey/*';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
  selector: '[dirSoSaoKhachSan]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: SoSaoKhachSanComboDirective,
    },
  ],
})
export class SoSaoKhachSanComboDirective implements ISelectOptions, OnInit {
  options$ = of<ISelectOption[]>([]);
  key = SessionKey.danhMucHuyen;

  constructor() {}

  ngOnInit(): void {
    this.options$ = this.getDataSourceFromServer();
  }

  getDataSourceFromServer(): Observable<ISelectOption[]> {
    return of<ISelectOption[]>([
      { value: 1, displayText: '1 sao' },
      { value: 2, displayText: '2 sao' },
      { value: 3, displayText: '3 sao' },
      { value: 4, displayText: '4 sao' },
      { value: 5, displayText: '5 sao' },
    ]);
  }
}
