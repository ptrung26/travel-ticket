import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { BookingServiceProxy, CreateOrUpdatThongTinBookingDto, CreateOrUpdateBookingRequest, CreateOrUpdateDichVuBookingTourDto, DichVuBookingTourDto, GetBookingByIdRequest, ThongTinChungBookingDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";
import { DichVuBookingTourComponent } from "./dich-vu-booking-tour/dich-vu-booking-tour.component";
import { ThongTinChungBookingComponent } from "./thong-tin-chung/thong-tin-chung-booking.component";
import _ from "lodash";

@Component({
    selector: 'crud-booking',
    templateUrl: './crud-booking.component.html',
})
export class CrudBookingComponent implements OnInit {
    title: string = "Thêm mới booking";
    @Input() id?: number;
    isShowTab: boolean = false;
    isEdit: boolean = false;
    @Output() closeEvent = new EventEmitter();
    thongTinChung: ThongTinChungBookingDto;
    dichVuBooking: DichVuBookingTourDto;
    selectedIdx: number = 0;
    @ViewChild("thongTinBooking", { static: false }) thongTinComp: ThongTinChungBookingComponent;
    @ViewChild("bookingTour", { static: false }) bookingTourComp: DichVuBookingTourComponent;

    constructor(private _dataService: BookingServiceProxy, private changeDetector: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        if (this.id > 0) {
            this.title = "Chỉnh sửa thông tin";
            const input = new GetBookingByIdRequest();
            input.id = this.id;
            this._dataService.getbyid(input).subscribe(res => {
                if (res.isSuccessful) {
                    this.thongTinChung = _.cloneDeep(res.dataResult.thongTinChung);
                    this.dichVuBooking = _.cloneDeep(res.dataResult.dichVuBookingTour);
                    this.changeDetector.detectChanges();
                }
                this.isShowTab = true;
                this.isEdit = true;

            })
        } else {
            this.isShowTab = true;
            this.changeDetector.detectChanges();
        }


    }

    close() {
        this.closeEvent.emit();
    }

    navigateTabThongTin(data: ThongTinChungBookingDto) {
        this.selectedIdx += 1;
        this.thongTinChung = data;
    }

    updateThongTin(data: ThongTinChungBookingDto) {
        this.thongTinChung = data;
        this.dichVuBooking = this.bookingTourComp.currentData;
        this.save();
    }

    updateDichVuTour(data: DichVuBookingTourDto) {
        this.dichVuBooking = data;
        this.thongTinChung = this.thongTinComp.currentData;
        this.save();
    }

    save() {

        const input = new CreateOrUpdateBookingRequest();
        input.booking = Object.assign(this.thongTinChung, new CreateOrUpdatThongTinBookingDto);
        input.tour = Object.assign(this.dichVuBooking, new CreateOrUpdateDichVuBookingTourDto);

        ora.ui.setBusy();
        this._dataService.createorupdate(input).pipe(finalize(() => {
            ora.ui.clearBusy();
        })).subscribe(res => {
            if (res.isSuccessful) {
                if (this.thongTinChung.id > 0) {
                    ora.notify.success("Cập nhật thông tin thành công!");
                } else {
                    ora.notify.success("Tạo booking thành công!");
                }
                this.closeEvent.emit();
            } else {
                ora.notify.error(res.errorMessage);
            }
        })
    }
}