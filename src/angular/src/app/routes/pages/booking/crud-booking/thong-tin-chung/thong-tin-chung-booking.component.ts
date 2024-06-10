import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThongTinChungBookingDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { KhachHangDto } from "@app/shared/service-proxies/san-pham-service-proxies";
import _ from "lodash";
import { DateTime } from 'luxon';
@Component({
    selector: 'thong-tin-chung-booking',
    templateUrl: './thong-tin-chung-booking.component.html',
    styleUrls: ['./thong-tin-chung-booking.component.scss']
})
export class ThongTinChungBookingComponent implements OnInit {
    @Input() thongTinChung?: ThongTinChungBookingDto;
    @Output() navigateEvt = new EventEmitter<ThongTinChungBookingDto>();
    @Output() saveEvt = new EventEmitter<ThongTinChungBookingDto>();
    rfForm: FormGroup;

    get currentData(): ThongTinChungBookingDto {
        this.patchValue();
        return this.thongTinChung;
    }

    constructor(private fb: FormBuilder) {
        this.rfForm = this.fb.group({
            ma: ["", [Validators.required]],
            ten: [""],
            nhanVienId: [1],
            ghiChu: [""],
            loaiKhachHangCode: ["", [Validators.required]],
            khachHangId: [null, [Validators.required]],
            email: ["", [Validators.required]],
            diaChi: [""],
            soDienThoai: ["",],
            ngayLap: [DateTime.now()],
            trangThai: [1] // Chờ xác nhận 
        })

    }
    ngOnInit(): void {
        if (this.thongTinChung?.id > 0) {
            this.rfForm.patchValue(this.thongTinChung);
        }
    }

    luaChonKhachKhang(data: KhachHangDto) {
        this.rfForm.get("khachHangId").setValue(data.id);
        this.rfForm.get("email").setValue(data.email);
        this.rfForm.get("soDienThoai").setValue(data.soDienThoai);
        this.rfForm.get("diaChi").setValue(data.diaChi);
    }

    navigate() {
        if (this.rfForm.invalid) {
            for (let i in this.rfForm.controls) {
                this.rfForm.controls[i].markAsDirty();
                this.rfForm.controls[i].updateValueAndValidity();
            }

            ora.notify.error('Vui lòng xem lại thông tin!');
        } else {
            this.patchValue();
            this.navigateEvt.emit(this.thongTinChung);
        }

    }

    save() {
        this.patchValue();
        this.saveEvt.emit(this.thongTinChung);
    }

    patchValue() {
        if (!this.thongTinChung) {
            this.thongTinChung = new ThongTinChungBookingDto();
        }
        Object.assign(this.thongTinChung, this.rfForm.value as ThongTinChungBookingDto);
        if (!this.thongTinChung.ngayLap) {
            this.thongTinChung.ngayLap = DateTime.now();
        }
    }
}