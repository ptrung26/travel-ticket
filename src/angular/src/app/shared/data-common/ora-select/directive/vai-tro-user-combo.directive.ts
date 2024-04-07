import { Directive, OnInit } from '@angular/core';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { TaiKhoanBaseCustomServiceProxy } from '@service-proxies/tai-khoan-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { map } from 'rxjs/operators';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
  selector: '[dirVaiTroUser]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: VaiTroUserComboDirective,
    },
  ],
})
export class VaiTroUserComboDirective implements ISelectOptions, OnInit {
  options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
  key = SessionKey.danhMucTinh;

  constructor(private _dataService: TaiKhoanBaseCustomServiceProxy, private _comboboxService: DataCommonService) {}

  ngOnInit(): void {
    this.getDataSourceFromServer();
  }

  getDataSourceFromServer() {
    this._comboboxService
      .getComboboxDataObs(
        this.key,
        this._dataService.vaitrousercombobox().pipe(
          map((lst) =>
            lst.map((item) => {
              const res: ISelectOption = {
                value: item.value.toString(),
                displayText: item.displayText,
              };
              return res;
            }),
          ),
        ),
      )
      .subscribe((result) => {
        this.options$.next(result);
      });
  }
}
