import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { DichVuBookingTourDto, ThongTinChungBookingDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { PagingListTourSanPhamRequest, TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { finalize } from "rxjs/operators";
import { CrudDichVuBookingTourComponent } from "./crud-dich-vu-booking-tour/crud-dich-vu-booking-tour.component";
import _ from "lodash";


@Component({
    selector: 'dich-vu-booking-tour',
    templateUrl: './dich-vu-booking-tour.component.html',
})
export class DichVuBookingTourComponent extends PagedListingComponentBase<any> implements OnInit {
    viewShow: 'list' | 'lua-chon' = 'list';
    rfForm: FormGroup;
    data: TourSanPhamDto;
    @Input() selectedTour?: DichVuBookingTourDto;
    @Input() thongTinChung: ThongTinChungBookingDto;
    @Output() navigateEvt = new EventEmitter<DichVuBookingTourDto>();
    @Output() saveEvt = new EventEmitter<DichVuBookingTourDto>();
    @ViewChild("crudBookingTour", { static: false }) crudBookingTourComp: CrudDichVuBookingTourComponent;

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: TourSanPhamServiceProxy, private changeDetector: ChangeDetectorRef) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: '',
        })
    }

    get currentData(): DichVuBookingTourDto {
        return this.crudBookingTourComp.currentData;
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListTourSanPhamRequest();
        const formValue = this.rfForm.value;
        input.filter = formValue.filter;
        input.skipCount = this.skipCount;
        input.sorting = this.sorting;
        input.maxResultCount = request.maxResultCount;

        this._dataService
            .getlist(input)
            .pipe(
                finalize(() => {
                }),
            )
            .subscribe((res) => {
                this.isTableLoading = false;
                this.dataList = res.items;
                this.totalItems = res.totalCount;
            });
    }

    select(data: TourSanPhamDto) {
        if (!data.thanhTienKhoangNguoiJson) {
            ora.notify.warn(`"${data.ten}" chưa chiết tính giá!`);
        } else {
            this.data = data;
            this.viewShow = 'lua-chon';
        }
    }

    navigate(data: DichVuBookingTourDto) {
        this.navigateEvt.emit(data);
    }

    updateThongTin(data: DichVuBookingTourDto) {
        this.selectedTour = data;
        this.saveEvt.emit(data);
    }

    save() {
        this.crudBookingTourComp.navigate();
        this.saveEvt.emit(this.selectedTour);
    }
}
