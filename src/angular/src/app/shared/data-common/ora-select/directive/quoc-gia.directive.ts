import { Directive, OnInit } from '@angular/core';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { CommonServiceProxy } from '@service-proxies/danh-muc-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { map } from 'rxjs/operators';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';

@Directive({
    selector: '[dirQuocGia]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: QuocGiaComboDirective,
        },
    ],
})
export class QuocGiaComboDirective implements ISelectOptions, OnInit {
    options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
    key = SessionKey.khachHang;

    constructor(private _dataService: CommonServiceProxy, private _comboboxService: DataCommonService) { }

    ngOnInit(): void {
        this.getDataSourceFromServer();
    }

    getDataSourceFromServer() {
        this._comboboxService
            .getComboboxDataObs(
                this.key,
                this._dataService.getquocgia().pipe(
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
