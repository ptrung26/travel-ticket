import { Component, Injector, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { CreateOrUpdateSoLuongMoBanTourRequest, TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";

@Component({
    templateUrl: './thong-tin-mo-ban-modal.component.html',
    styleUrls: ['./thong-tin-mo-ban-modal.component.scss']
})
export class ThongTinMoBanModalComponent extends ModalComponentBase implements OnInit {
    rfForm: FormGroup;
    @Input() dataItem: TourSanPhamDto;
    constructor(injector: Injector, private _dataService: TourSanPhamServiceProxy, private fb: FormBuilder) {
        super(injector);
    }

    ngOnInit(): void {
        this.rfForm = this.fb.group({
            soLuongMoBan: [null, [Validators.required]],
            thoiGianMoBan: [null],
        })
        this.rfForm.patchValue(this.dataItem);
    }



    save() {
        if (this.rfForm.invalid) {
            for (let i in this.rfForm.controls) {
                this.rfForm.controls[i].markAsDirty();
                this.rfForm.controls[i].updateValueAndValidity();
            }
            ora.notify.error('Vui lòng xem lại thông tin!');
        } else {
            const formValue = this.rfForm.value;
            const input = new CreateOrUpdateSoLuongMoBanTourRequest();
            input.soLuongMoBan = formValue.soLuongMoBan;
            input.thoiGianMoBan = formValue.thoiGianMoBan;
            input.id = this.dataItem.id;

            ora.ui.setBusy();
            this._dataService.capnhapsoluongmoban(input).subscribe(res => {
                ora.ui.clearBusy();
                if (res.isSuccessful) {
                    this.success(true);
                }
            })
        }
    }

}