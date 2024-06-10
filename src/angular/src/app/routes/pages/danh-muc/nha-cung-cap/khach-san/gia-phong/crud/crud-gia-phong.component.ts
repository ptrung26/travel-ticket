import { Component, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { CreateOrUpdateDichVuGiaPhongRequest, CreateOrUpdateHangPhongRequest, CreateOrUpdateNguoiLienHeNCCRequest, DichVuGiaPhongDto, DichVuHangPhongDto, DichVuPhongServiceProxy, GetGiaPhongByIdRequest, GetHangPhongByIdRequest, GetNguoiLienByIdRequest, NguoiLienHeNCCDto, NguoiLienHeServiceProxy } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'crud-gia-phong',
    templateUrl: './crud-gia-phong.component.html',
    styleUrls: ['./crud-gia-phong.component.scss']
})
export class CreateOrUpdateGiaPhongComponent extends ModalComponentBase {
    rfForm: FormGroup;
    @Input() dataItem: DichVuGiaPhongDto;
    @Input() nhaCungCapId: number;
    constructor(injector: Injector, private fb: FormBuilder, private _dataService: DichVuPhongServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            tenPhong: ["", [Validators.required]],
            hangPhongId: [1],
            ngayApDungTu: [null],
            ngayApDungDen: [null],
            giaFOTNettNgayThuong: [null],
            giaFOTBanNgayThuong: [null],
            giaFOTNettNgayLe: [null],
            giaFOTBanNgayLe: [null],
        })
    }

    ngOnInit(): void {
        if (this.dataItem?.id > 0) {
            this.title = "Chỉnh sửa thông tin hạng phòng";
            ora.ui.setBusy();
            const input = new GetGiaPhongByIdRequest();
            input.id = this.dataItem.id;
            this._dataService.getgiaphongbyid(input).pipe(finalize(() => {
                ora.ui.clearBusy();
            })).subscribe(res => {
                if (res.isSuccessful) {
                    this.dataItem = res.dataResult;
                    this.rfForm.patchValue(this.dataItem);
                } else {
                    ora.notify.error(res.errorMessage);
                }
            })
        }
    }

    save() {
        const input = new CreateOrUpdateDichVuGiaPhongRequest();
        Object.assign(input, this.rfForm.value);
        input.nhaCungCapKhachSanId = this.nhaCungCapId;
        if (this.dataItem?.id > 0) {
            input.id = this.dataItem?.id;
        }
        ora.ui.setBusy();
        this._dataService.createorupdatedichvugiaphong(input).pipe(finalize(() => {
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