import { Directive, OnInit } from '@angular/core';
import { CommonServiceProxy } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { BehaviorSubject } from '@node_modules/rxjs';
import { SessionKey } from '@sessionKey/*';
import { map } from 'rxjs/operators';
import { DataCommonService } from '../../data-common.service';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
  selector: '[dirAllUserVanBan]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: GetAllUserVanBanComboDirective,
    },
  ],
})
export class GetAllUserVanBanComboDirective implements ISelectOptions, OnInit {
  options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
  key = SessionKey.khachHang;

  constructor(private _dataService: CommonServiceProxy, private _comboboxService: DataCommonService) {}

  ngOnInit(): void {
    this.getDataSourceFromServer();
  }

  getDataSourceFromServer() {
    this._comboboxService
      .getComboboxDataObs(
        this.key,
        this._dataService.getallusersvanban([]).pipe(
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
