import { Component, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { DichVuXeServiceProxy, PagingListDichVuXeRequest } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";
import { CrudDichVuCungCapXeComponent } from "./crud-dich-vu-cung-cap-xe/crud-dich-vu-cung-cap-xe.component";

@Component({
    selector: 'dich-vu-cung-cap-xe',
    templateUrl: './dich-vu-cung-cap-xe.component.html'
})
export class DichVuCungCapXeComponent extends PagedListingComponentBase<any> {
    @Input() nhaCungCapXeId: number;
    rfForm: FormGroup;

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: DichVuXeServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: [""],
        })
    }
    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        if (this.nhaCungCapXeId > 0) {
            const formValue = this.rfForm.value;
            const input = new PagingListDichVuXeRequest();
            input.filter = formValue.filter;
            input.maxResultCount = request.maxResultCount;
            input.skipCount = request.skipCount;
            input.sorting = request.sorting;
            input.nhaCungCapXeId = this.nhaCungCapXeId;
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
    }

    showCreateOrUpdate(id?: number) {
        this.modalHelper.create(
            CrudDichVuCungCapXeComponent,
            {
                nhaCungCapXeId: this.nhaCungCapXeId,
                id: id,
            },
            {
                size: 1200,
                includeTabs: false,
                modalOptions: {
                    nzTitle: id ? 'Chỉnh sửa dịch vụ' : 'Thêm mới dịch vụ',
                },
            },
        ).subscribe((result) => {
            if (result) {
                if (id) {
                    ora.notify.success("Chỉnh sửa thành công!");
                } else {
                    ora.notify.success("Thêm mới thành công!");
                }
                this.refresh();
            } else {
                ora.notify.error("Có lỗi xảy ra, vui lòng thử lại sau!");
            }
        });
    }

}