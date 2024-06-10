import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { DichVuHangPhongDto, DichVuPhongServiceProxy, PagingListHangPhongRequest } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateHangPhongComponent } from './crud/create-or-update-hang-phong.component';

@Component({
    selector: 'hang-phong',
    templateUrl: './hang-phong.component.html',
    styleUrls: ['./hang-phong.component.scss'],
})
export class HangPhongComponent extends PagedListingComponentBase<any> implements OnChanges {

    rfForm: FormGroup;
    @Input() nhaCungCapId: number;

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: DichVuPhongServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: "",
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.nhaCungCapId > 0) {
            this.refresh();
        }
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListHangPhongRequest();
        const formValue = this.rfForm.value;
        input.filter = formValue.filter;
        input.skipCount = this.skipCount;
        input.sorting = this.sorting;
        input.maxResultCount = request.maxResultCount;
        input.nhaCungCapId = this.nhaCungCapId;
        ora.ui.setBusy();
        this._dataService
            .paginglisthangphong(input)
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

    showCreateOrUpdate(dataItem?: DichVuHangPhongDto) {
        this.modalHelper.create(
            CreateOrUpdateHangPhongComponent,
            {
                dataItem: dataItem,
                nhaCungCapId: this.nhaCungCapId,
            },
            {
                size: 'md',
                includeTabs: false,
                modalOptions: {
                    nzTitle: dataItem?.id > 0 ? "Chỉnh sửa thông tin hạng phòng" : "Thêm mới thông tin hạng phòng"
                },
            },
        ).subscribe((result) => {
            if (result) {
                let message = dataItem?.id > 0 ? "Chỉnh sửa thông tin thành công!" : "Thêm mới thành công!";
                ora.notify.success(message);
                this.refresh();
            }
        });
    }



}
