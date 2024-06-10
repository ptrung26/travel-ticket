import { Component, Injector, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { CreateOrUpdateDichVuXeRequest, DichVuXeDto, DichVuXeServiceProxy, GetDichVuXeByIdRequest } from "@app/shared/service-proxies/danh-muc-service-proxies";

@Component({
    templateUrl: './crud-dich-vu-cung-cap-xe.component.html',
    styleUrls: ['./crud-dich-vu-cung-cap-xe.component.scss']
})
export class CrudDichVuCungCapXeComponent extends ModalComponentBase implements OnInit {
    rfForm: FormGroup;
    @Input() id?: number;
    @Input() nhaCungCapXeId: number;
    data: DichVuXeDto;
    constructor(injector: Injector, private fb: FormBuilder, private _dataService: DichVuXeServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            ma: ["", [Validators.required]],
            ten: ["", [Validators.required]],
            soKMDuTinh: [null],
            loaiXeCode: [""],
            soChoCode: [""],
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
            const input = new GetDichVuXeByIdRequest();
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
            const input = new CreateOrUpdateDichVuXeRequest();
            input.nhaCungCapXeId = this.nhaCungCapXeId;
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