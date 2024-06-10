import { Component, Injector } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { BookingServiceProxy, PagingListBookingRequest, ThongTinChungBookingDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html'
})
export class BookingComponent extends PagedListingComponentBase<any> {
    viewShow: 'list' | 'create-or-update' = 'list';
    rfForm: FormGroup;
    data: ThongTinChungBookingDto;

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: BookingServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: '',
        })
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListBookingRequest();
        const formValue = this.rfForm.value;
        input.filter = formValue.filter;
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

    showCreateOrUpdate(data?: ThongTinChungBookingDto) {
        this.data = data;
        this.viewShow = "create-or-update";
    }

    chuyenTrangThai(data: ThongTinChungBookingDto, trangThai: number) {
        this._dataService.thaydoitrangthai(data.id, trangThai).subscribe(res => {
            if (res.isSuccessful) {
                if (trangThai == 2) {
                    ora.notify.success("Chuyển sang điều hành thành công!");
                }
                else if (trangThai == 5) {
                    ora.notify.success("Huỷ booking thành công!");
                }
                else if (trangThai == 6) {
                    ora.notify.success("Chuyển trạng thái kết thúc thành công!");
                }
            }

            this.refresh();
        })
    }

    closeEvent() {
        this.viewShow = 'list';
        this.refresh();
    }

}