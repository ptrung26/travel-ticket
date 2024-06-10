import { Component, Injector, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { CreateOrUpdateDichVuVeRequest, CreateOrUpdateDichVuXeRequest, DichVuVeDto, DichVuVeServiceProxy, GetDichVuVeByIdRequest } from "@app/shared/service-proxies/danh-muc-service-proxies";

@Component({
    templateUrl: './crud-dich-vu-cung-cap-ve.component.html',
    styleUrls: ['./crud-dich-vu-cung-cap-ve.component.scss']
})
export class CrudDichVuCungCapVeComponent extends ModalComponentBase implements OnInit {
    rfForm: FormGroup;
    @Input() id?: number;
    @Input() nhaCungCapVeId: number;
    data: DichVuVeDto;
    constructor(injector: Injector, private fb: FormBuilder, private _dataService: DichVuVeServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            ma: ["", [Validators.required]],
            ten: ["", [Validators.required]],
            loaiTienTeCode: [""],
            tuNgay: [null],
            denNgay: [null],
            tinhTrang: [true],
            giaNett: [null],
            giaBan: [null],
            isHasThueVAT: [null],
            ghiChu: [""],
        })
    }

    ngOnInit(): void {
        if (this.id) {
            const input = new GetDichVuVeByIdRequest();
            input.id = this.id;
            ora.ui.setBusy();
            this._dataService.getbyid(input).subscribe(res => {
                ora.ui.clearBusy();
                if (!res.isSuccessful) {
                    ora.notify.error(res.errorMessage);
                } else {
                    this.data = res.dataResult;
                    this.rfForm.patchValue(this.data);
                }
            })
        }
    }

    save() {
        if (this.rfForm.invalid) {
            for (let i in this.rfForm.controls) {
                this.rfForm.controls[i].markAsDirty();
                this.rfForm.controls[i].updateValueAndValidity();
            }
            ora.notify.error('Vui lòng xem lại thông tin!');
        } else {
            const input = new CreateOrUpdateDichVuVeRequest();
            input.nhaCungCapVeId = this.nhaCungCapVeId;
            input.id = this.data?.id;
            Object.assign(input, this.rfForm.value);
            this._dataService.createorupdate(input).subscribe(res => {
                if (res.isSuccessful) {
                    this.success(true);
                } else {
                    this.close();
                }
            })
        }
    }
}