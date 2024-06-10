import { Component, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { NhaCungCapVeServiceProxy, PagingListNhaCungCapVeRequest } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'nha-cung-cap-ve',
    templateUrl: './nha-cung-cap-ve.component.html',
})
export class NhaCungCapVeComponent extends PagedListingComponentBase<any> {
    rfForm: FormGroup;
    viewShow: 'list' | 'create-or-update' = 'list';
    id: number;

    constructor(private injector: Injector, private fb: FormBuilder, private _dataService: NhaCungCapVeServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: [''],
            soSaoDanhGia: [null],
        });
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListNhaCungCapVeRequest();
        const formValue = this.rfForm.value;
        input.filter = formValue.filter;
        input.soSaoDanhGia = formValue.soSao;
        input.skipCount = this.skipCount;
        input.sorting = this.sorting;
        input.maxResultCount = request.maxResultCount;

        ora.ui.setBusy();
        this._dataService
            .paginglist(input)
            .pipe(
                finalize(() => {
                    ora.ui.clearBusy();
                }),
            )
            .subscribe((res) => {
                this.isTableLoading = false;
                this.dataList = res.items;
                this.totalItems = res.totalCount;
            });
    }

    showCreateOrUpdate(id?: number) {
        this.viewShow = 'create-or-update';
        this.id = id;
    }

    close() {
        this.viewShow = 'list';
        this.refresh();
    }
}
