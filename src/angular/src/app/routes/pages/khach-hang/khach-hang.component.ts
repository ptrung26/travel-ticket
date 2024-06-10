import { Component, Injector } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { KhachHangDto, KhachHangServiceProxy, PagingListKhachHangRequest } from "@app/shared/service-proxies/san-pham-service-proxies";
import { finalize } from "rxjs/operators";
import { CrudKhachHangComponent } from "./crud-khach-hang/crud-khach-hang.component";

@Component({
    selector: 'khach-hang',
    templateUrl: './khach-hang.component.html'
})
export class KhachHangComponent extends PagedListingComponentBase<any> {

    rfForm: FormGroup;
    data: KhachHangDto;

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: KhachHangServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: '',
        })
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListKhachHangRequest();
        const formValue = this.rfForm.value;
        input.filter = formValue.filter;
        input.skipCount = this.skipCount;
        input.sorting = this.sorting;
        input.maxResultCount = request.maxResultCount;
        ora.ui.setBusy();
        this._dataService
            .getlist(input)
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

    showCreateOrUpdate(data?: KhachHangDto) {
        this.data = data;
        this.modalHelper.create(CrudKhachHangComponent, {
            id: this.data?.id,
        },
            {
                size: 'lg',
                includeTabs: false,
                modalOptions: {
                    nzTitle: this.data ? "Thêm mới khách hàng" : "Chỉnh sửa thông tin",
                },
            },
        ).subscribe((result) => {
            if (result) {
                if (this.data?.id) {
                    ora.notify.success("Chỉnh sửa thành công");
                } else {
                    ora.notify.success("Thêm mới thành công");
                }
                this.refresh();
            }
        });
    }
}