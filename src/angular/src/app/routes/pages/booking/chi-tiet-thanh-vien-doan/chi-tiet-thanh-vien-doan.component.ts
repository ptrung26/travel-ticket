import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { BookingServiceProxy, ChiTietThanhVienDoanDto, CreateOrUpdateHangPhongRequest, DichVuGiaPhongDto, DichVuHangPhongDto, DichVuPhongServiceProxy, NguoiLienHeNCCDto, NguoiLienHeServiceProxy, PagingListGiaPhongRequest, PagingListHangPhongRequest, PagingListNguoiLienHeRequest, PagingListThanhVienDoanRequest } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateThanhVienDoanComponent } from './crud/crud-thanh-vien-doan.component';

@Component({
    selector: 'chi-tiet-thanh-vien-doan',
    templateUrl: './chi-tiet-thanh-vien-doan.component.html',
})
export class ChiTietThanhVienDoanComponent extends PagedListingComponentBase<any> implements OnChanges {

    rfForm: FormGroup;
    @Input() bookingId: number;

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: BookingServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: "",
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.bookingId > 0) {
            this.refresh();
        }
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListThanhVienDoanRequest();
        const formValue = this.rfForm.value;
        input.filter = formValue.filter;
        input.skipCount = this.skipCount;
        input.sorting = this.sorting;
        input.maxResultCount = request.maxResultCount;
        input.bookingId = this.bookingId;
        ora.ui.setBusy();
        this._dataService
            .paginglistthanhviendoan(input)
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

    showCreateOrUpdate(dataItem?: ChiTietThanhVienDoanDto) {
        this.modalHelper.create(
            CreateOrUpdateThanhVienDoanComponent,
            {
                dataItem: dataItem,
                bookingId: this.bookingId,
            },
            {
                size: 'md',
                includeTabs: false,
                modalOptions: {
                    nzTitle: dataItem?.id > 0 ? "Chỉnh sửa thông tin thành viên đoàn" : "Thêm mới thông tin thành viên đoàn"
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
