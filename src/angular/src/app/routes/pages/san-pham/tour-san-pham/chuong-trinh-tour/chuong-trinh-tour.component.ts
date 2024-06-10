import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { ChuongTrinhTourDto, PagingListChuongTrinhTourRequest, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { FormBuilder } from "@ngneat/reactive-forms";
import { UpdateChuongTrinhTourComponent } from "./update-chuong-trinh-tour/update-chuong-trinh-tour.component";

@Component({
    selector: 'chuong-trinh-tour',
    templateUrl: './chuong-trinh-tour.component.html'
})
export class ChuongTrinhTourComponent extends PagedListingComponentBase<any> implements OnInit, OnChanges {
    @Input() tourSanPhamId: number;
    constructor(injector: Injector, private _dataService: TourSanPhamServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.tourSanPhamId > 0) {
            this.refresh();
        }
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListChuongTrinhTourRequest();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        input.tourSanPhamId = this.tourSanPhamId;
        ora.ui.setBusy();
        this._dataService.getchuongtrinhtour(input).subscribe(res => {
            ora.ui.clearBusy();
            this.isTableLoading = false;
            this.dataList = res.items;
            this.showPaging(res);
        })
    }

    getListDichVu(data: ChuongTrinhTourDto) {
        const arr = JSON.parse(data.listDichVuJson) ?? [];
        let displays = [];
        arr.forEach((item: string) => {
            if (item == "KhachSan") {
                displays.push("Khách sạn");
            } else if (item == "XeOto") {
                displays.push("Xe ô tô");
            } else if (item == "VeThangCanh") {
                displays.push("Vé thắng cảnh");
            }
        });
        if (displays.length > 0) {
            return displays.toString();
        }
    }

    showUpdateChuongTrinhTour(data: ChuongTrinhTourDto) {
        this.modalHelper.create(
            UpdateChuongTrinhTourComponent,
            {
                dataItem: data,
            },
            {
                size: 1200,
                includeTabs: false,
                modalOptions: {
                    nzTitle: "Chỉnh sửa chương trình Tour"
                },
            },
        ).subscribe((result) => {
            if (result) {
                ora.notify.success("Chỉnh sửa chương trình tour thành công!");
                this.refresh();
            }
        });
    }

}