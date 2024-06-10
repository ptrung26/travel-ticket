import { Directive, OnInit } from '@angular/core';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { BehaviorSubject } from '@node_modules/rxjs';
import { CommonServiceProxy } from '@service-proxies/danh-muc-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[dirLoaiTienTe]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: LoaiTietTeComboDirective,
        },
    ],
})
export class LoaiTietTeComboDirective implements ISelectOptions, OnInit {
    options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
    key = SessionKey.danhMucHuyen;

    constructor(private _dataService: CommonServiceProxy, private _comboboxService: DataCommonService) { }

    ngOnInit(): void {
        this.getDataSourceFromServer();
    }

    getDataSourceFromServer() {
        this._dataService.getloaitientecombobox().pipe(
            map((lst) =>
                lst.map((item) => {
                    const res: ISelectOption = {
                        value: item.value,
                        displayText: item.displayText,
                    };
                    return res;
                }),
            )).subscribe((result) => {
                this.options$.next(result);
            });
    }
}
