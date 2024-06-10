import { Component, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { CreateOrUpdateNguoiLienHeNCCRequest, GetNguoiLienByIdRequest, NguoiLienHeNCCDto, NguoiLienHeServiceProxy } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'create-or-update-nguoi-lien-he',
    templateUrl: './create-or-update-nguoi-lien-he.component.html',
    styleUrls: ['./create-or-update-nguoi-lien-he.component.scss']
})
export class CreateOrUpdateNguoiLienHeComponent extends ModalComponentBase {
    rfForm: FormGroup;
    @Input() dataItem?: NguoiLienHeNCCDto;
    @Input() nhaCungCapId: number;
    @Input() nhaCungCapCode?: string;
    constructor(injector: Injector, private fb: FormBuilder, private _dataService: NguoiLienHeServiceProxy) {
        super(injector);
        this.rfForm = this.fb.group({
            hoVaTen: [""],
            email: [""],
            dienThoai: [""],
            chucVu: [""],
            phongBan: [""],
        })
    }

    ngOnInit(): void {
        if (this.dataItem?.id > 0) {
            this.title = "Chỉnh sửa thông tin người liên hệ";
            ora.ui.setBusy();
            const input = new GetNguoiLienByIdRequest();
            input.id = this.dataItem.id;
            this._dataService.getbyid(input).pipe(finalize(() => {
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
        const input = new CreateOrUpdateNguoiLienHeNCCRequest();
        Object.assign(input, this.rfForm.value);
        input.nhaCungCapId = this.nhaCungCapId;
        input.nhaCungCapCode = this.nhaCungCapCode;
        if (this.dataItem?.id > 0) {
            input.id = this.dataItem?.id;
        }
        ora.ui.setBusy();
        this._dataService.createorupdate(input).pipe(finalize(() => {
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