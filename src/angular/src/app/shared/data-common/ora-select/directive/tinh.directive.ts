import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { CommonServiceProxy } from '@service-proxies/danh-muc-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { mergeMap, map, filter, debounceTime } from 'rxjs/operators';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
    selector: '[dirTinh]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: TinhComboDirective,
        },
    ],
})
export class TinhComboDirective implements ISelectOptions, OnInit {
    options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
    key = SessionKey.danhMucTinh;

    constructor(private _dataService: CommonServiceProxy, private _comboboxService: DataCommonService) { }

    ngOnInit(): void {
        this.getDataSourceFromServer();
    }

    getDataSourceFromServer() {
        const key = 'combo-data-tinh';
        const cache = sessionStorage.getItem(key);
        if (cache) {
            let lst = JSON.parse(cache);
            this.options$.next(lst);
            return;
        }
        this._comboboxService
            .getComboboxDataObs(
                this.key,
                this._dataService.danhMucTinhCombo().pipe(
                    map((lst) =>
                        lst.map((item) => {
                            const res: ISelectOption = {
                                value: item.value,
                                displayText: item.displayText,
                                data: item.data,
                            };
                            return res;
                        }),
                    ),
                ),
            )
            .subscribe((result) => {
                sessionStorage.setItem(key, JSON.stringify(result));
                this.options$.next(result);
            });
    }
}
