import { Component, Injector, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { PagingListTourSanPhamRequest, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { ReuseTabService } from "@delon/abc/reuse-tab";
import { TitleService } from "@delon/theme";
import { FormBuilder } from "@ngneat/reactive-forms";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'filter-tour-du-lich',
    templateUrl: './filter-tour-du-lich.component.html',
    styleUrls: ['./filter-tour-du-lich.component.scss']
})
export class FilterTourDuLichComponent extends PagedListingComponentBase<any> implements OnInit {

    rfForm: FormGroup;
    constructor(injector: Injector, private _dataService: TourSanPhamServiceProxy, private fb: FormBuilder,
        private titleService: TitleService, private reuseService: ReuseTabService) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: "",
            quocGiaId: "",
            tinhId: "",
        })

    }
    ngOnInit(): void {
        this.titleService.setTitle("Tour du lịch");
        this.reuseService.title = "Tour du lịch";
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const formValue = this.rfForm.value;
        const input = new PagingListTourSanPhamRequest();
        Object.assign(input, formValue);
        input.maxResultCount = request.maxResultCount;
        input.skipCount = this.skipCount;
        ora.ui.setBusy();
        this._dataService.filterTourDuLich(input).pipe(finalize(() => {
            ora.ui.clearBusy();
        })).subscribe(res => {
            this.dataList = res.items;
            this.totalItems = res.totalCount;
        })
    }

    onPageNumberChange(index: number) {
        this.pageNumber = index;
        this.refresh();
    }



}