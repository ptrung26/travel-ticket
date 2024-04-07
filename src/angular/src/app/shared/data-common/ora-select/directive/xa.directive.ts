import { Directive, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { CommonServiceProxy, XaComboboxRequest } from '@service-proxies/danh-muc-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { map } from 'rxjs/operators';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
  selector: '[dirXa]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: XaComboDirective,
    },
  ],
})
export class XaComboDirective implements ISelectOptions, OnInit, OnChanges {
  options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
  key = SessionKey.danhMucXa;

  @Input() huyenId: string;

  constructor(private _dataService: CommonServiceProxy, private _comboboxService: DataCommonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.huyenId.currentValue !== changes.huyenId.previousValue &&
      !ora.equalEmpty(changes.huyenId.currentValue, changes.huyenId.previousValue)
    ) {
      this.getDataSourceFromServer(changes.huyenId.currentValue);
    }
  }

  ngOnInit(): void {
    this.getDataSourceFromServer();
  }

  getDataSourceFromServer(huyenId?: string) {
    if (huyenId) {
      const input = new XaComboboxRequest();
      input.huyenId = huyenId;
      this._comboboxService
        .getComboboxDataObs(
          this.key + '_' + huyenId,
          this._dataService.danhMucXaCombo(input).pipe(
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
          this.options$.next(result);
        });
    } else {
      this.options$.next([]);
    }
  }
}
