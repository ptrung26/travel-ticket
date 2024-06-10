import { Component, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { BookingServiceProxy, ChiTietThanhVienDoanDto, CreateOrUpdateBookingRequest, CreateOrUpdateHangPhongRequest, CreateOrUpdateNguoiLienHeNCCRequest, CreateOrUpdateThanhVienDoanRequest, DichVuHangPhongDto, DichVuPhongServiceProxy, GetHangPhongByIdRequest, GetNguoiLienByIdRequest, NguoiLienHeNCCDto, NguoiLienHeServiceProxy } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'crud-thanh-vien-doan',
    templateUrl: './crud-thanh-vien-doan.component.html',
})
export class CreateOrUpdateThanhVienDoanComponent extends ModalComponentBase {
    rfForm: FormGroup;
    @Input() dataItem: ChiTietThanhVienDoanDto;
    @Input() bookingId: number;
    @Input() soLuongThanhVienDoan: number;
    constructor(injector: Injector, private fb: FormBuilder, private _dataService: BookingServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            ten: ["", Validators.required],
            email: ["", Validators.required],
            soDienThoai: ["", Validators.required],
            quocTichId: [null, Validators.required],
            vaiTroCode: [""],
        })
    }

    ngOnInit(): void {
        if (this.dataItem?.id > 0) {
            this.title = "Chỉnh sửa thông tin thành viên đoàn";
        }
    }

    save() {
        const input = new CreateOrUpdateThanhVienDoanRequest();
        Object.assign(input, this.rfForm.value);
        input.bookingId = this.bookingId;
        if (this.dataItem?.id > 0) {
            input.id = this.dataItem?.id;
        }
        ora.ui.setBusy();
        this._dataService.createorupdatethanhviendoan(input).pipe(finalize(() => {
            ora.ui.clearBusy();
        })).subscribe(res => {
            if (res.isSuccessful) {
                this.success(true);
            } else {
                ora.notify.error(res.errorMessage);
            }
        })
    }

}