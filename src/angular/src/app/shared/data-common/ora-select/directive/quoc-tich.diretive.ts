import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { CommonServiceProxy } from '@service-proxies/danh-muc-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { mergeMap, map, filter, debounceTime } from 'rxjs/operators';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
    selector: '[dirQuocTich]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: QuocTichComboDirective,
        },
    ],
})
export class QuocTichComboDirective implements ISelectOptions, OnInit {
    options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
    key = SessionKey.danhMucQuocTich;

    constructor(private _dataService: CommonServiceProxy, private _comboboxService: DataCommonService) { }

    ngOnInit(): void {
        this.getDataSourceFromServer();
    }

    getDataSourceFromServer() {
        this._comboboxService
            .getComboboxDataObs(
                this.key,
                this._dataService.danhMucQuocTichCombo().pipe(
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
    }
}
