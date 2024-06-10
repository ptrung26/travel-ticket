import { Component, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { CreateOrUpdateHangPhongRequest, CreateOrUpdateNguoiLienHeNCCRequest, DichVuHangPhongDto, DichVuPhongServiceProxy, GetHangPhongByIdRequest, GetNguoiLienByIdRequest, NguoiLienHeNCCDto, NguoiLienHeServiceProxy } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'create-or-update-hang-phong',
    templateUrl: './create-or-update-hang-phong.component.html',
    styleUrls: ['./create-or-update-hang-phong.component.scss']
})
export class CreateOrUpdateHangPhongComponent extends ModalComponentBase {
    rfForm: FormGroup;
    @Input() dataItem: DichVuHangPhongDto;
    @Input() nhaCungCapId: number;
    constructor(injector: Injector, private fb: FormBuilder, private _dataService: DichVuPhongServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            tenHangPhong: [undefined, Validators.required],
            moTa: [""],
            soLuongPhong: [null, [Validators.required, Validators.min(1)]],
            soKhachToiDa: [null, [Validators.required, Validators.min(1)]],
            kichThuocPhong: [null, [Validators.required, Validators.min(1)]],
            slPhongFOC: [null, Validators.required],
            jsonTaiLieu: [""]
        })
    }

    ngOnInit(): void {
        if (this.dataItem?.id > 0) {
            this.title = "Chỉnh sửa thông tin hạng phòng";
            ora.ui.setBusy();
            const input = new GetHangPhongByIdRequest();
            input.id = this.dataItem.id;
            this._dataService.gethangphongbyid(input).pipe(finalize(() => {
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
        const input = new CreateOrUpdateHangPhongRequest();
        Object.assign(input, this.rfForm.value);
        input.nhaCungCapId = this.nhaCungCapId;
        if (this.dataItem?.id > 0) {
            input.id = this.dataItem?.id;
        }
        ora.ui.setBusy();
        this._dataService.createorupdatehangphong(input).pipe(finalize(() => {
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