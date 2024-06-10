import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalComponentBase } from '@app/shared/common/modal-component-base';
import {
    CreateOrUpdateKhachHangRequest,
    GetKhachHangByIdRequest,
    KhachHangDto,
    KhachHangServiceProxy
} from '@app/shared/service-proxies/san-pham-service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'crud-khach-hang',
    templateUrl: './crud-khach-hang.component.html',
})
export class CrudKhachHangComponent extends ModalComponentBase implements OnInit {
    rfForm: FormGroup;
    @Input() id?: number;
    data: KhachHangDto

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: KhachHangServiceProxy) {
        super(injector);

        this.rfForm = this.fb.group({
            ma: [''],
            ten: [''],
            soDienThoai: [''],
            email: [''],
            diaChi: [''],
        });
    }

    ngOnInit(): void {
        if (this.id) {
            const input = new GetKhachHangByIdRequest();
            input.id = this.id;
            ora.ui.setBusy();
            this._dataService.getbyid(input).subscribe((res) => {
                ora.ui.clearBusy();
                if (res.isSuccessful) {
                    this.data = res.dataResult;
                    this.rfForm.patchValue(this.data);
                } else {
                    ora.notify.error(res.errorMessage);
                }
            });
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
            const input = new CreateOrUpdateKhachHangRequest();
            Object.assign(input, this.rfForm.value);
            if (this.data?.id > 0) {
                input.id = this.data.id;
            }
            ora.ui.setBusy();
            this._dataService
                .createorupdate(input)
                .pipe(
                    finalize(() => {
                        ora.ui.clearBusy();
                    }),
                )
                .subscribe((res) => {
                    if (res.isSuccessful) {
                        this.success(true)
                    } else {
                        ora.notify.error(res.errorMessage);
                    }
                });
        }
    }
}
