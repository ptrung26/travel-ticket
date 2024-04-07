import { Directive, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { CommonServiceProxy, HuyenComboboxRequest } from '@service-proxies/danh-muc-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { map } from 'rxjs/operators';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
  selector: '[dirHuyen]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: HuyenComboDirective,
    },
  ],
})
export class HuyenComboDirective implements ISelectOptions, OnInit, OnChanges {
  options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
  key = SessionKey.danhMucHuyen;

  @Input() tinhId: string;

  constructor(private _dataService: CommonServiceProxy, private _comboboxService: DataCommonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.tinhId.currentValue !== changes.tinhId.previousValue &&
      !ora.equalEmpty(changes.tinhId.currentValue, changes.tinhId.previousValue)
    ) {
      this.getDataSourceFromServer(changes.tinhId.currentValue);
    }
  }

  ngOnInit(): void {
    this.getDataSourceFromServer();
  }

  getDataSourceFromServer(tinhId?: string) {
    if (tinhId) {
      const input = new HuyenComboboxRequest();
      input.tinhId = tinhId;
      this._comboboxService
        .getComboboxDataObs(
          this.key + '_' + tinhId,
          this._dataService.danhMucHuyenCombo(input).pipe(
            map((lst) =>
              lst.map((item) => {
                const res: ISelectOption = {
                  value: item.value,
                  displayText: item.displayText,
                };
                return res;
              }),
            ),
          ),
        )
        .subscribe((result) => {
          // console.log('getDataSourceFromServer,', result);
          this.options$.next(result);
        });
    } else {
      this.options$.next([]);
    }
  }
}
