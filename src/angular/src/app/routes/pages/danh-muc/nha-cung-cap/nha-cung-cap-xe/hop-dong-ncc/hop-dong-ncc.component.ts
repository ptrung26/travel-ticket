import { Component, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { HopDongNCCDto, HopDongNccServiceProxy, PagingListHopDongNCCRequest } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'hop-dong-ncc',
    templateUrl: './hop-dong-ncc.component.html'
})
export class HopDongNCCComponent extends PagedListingComponentBase<any> {
    viewShow: 'list' | 'create-or-update' = "list";
    rfForm: FormGroup;
    @Input() nhaCungCapId: number;
    data?: HopDongNCCDto;
    constructor(injector: Injector, private fb: FormBuilder, private _dataService: HopDongNccServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: "",
        })
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListHopDongNCCRequest();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfForm.value;
        input.filter = formValue.filter;
        input.nhaCungCapId = this.nhaCungCapId;
        this._dataService
            .paginglisthopdongncc(input)
            .pipe(finalize(finishedCallback))
            .subscribe((rs) => {
                this.dataList = rs.items;
                this.showPaging(rs);
            });
    }

    showCreateOrUpdate(data?: HopDongNCCDto) {
        this.viewShow = "create-or-update";
        this.data = data;
    }

}