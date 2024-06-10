import { Component, Injector, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { ChuongTrinhTourDto, CommonServiceProxy, CreateOrUpdateChuongTrinhTourRequest, GetChuongTrinhTourByIdRequest, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { ComboBoxDto } from "@app/shared/service-proxies/tai-khoan-service-proxies";

@Component({
    templateUrl: './update-chuong-trinh-tour.component.html',
    styleUrls: ['./update-chuong-trinh-tour.component.scss']
})
export class UpdateChuongTrinhTourComponent extends ModalComponentBase implements OnInit {

    rfForm: FormGroup;
    listDichVu: ComboBoxDto[] = [];
    listDichVuSelected: string[] = [];
    @Input() dataItem: ChuongTrinhTourDto;

    constructor(injector: Injector, private fb: FormBuilder, private _dataService: TourSanPhamServiceProxy, private _commonService: CommonServiceProxy) {
        super(injector);

    }
    ngOnInit(): void {
        this.rfForm = this.fb.group({
            ngayThu: [{ value: this.dataItem.ngayThu, disabled: true }],
            diemDen: [""],
            tenHanhTrinh: ["", [Validators.required]],
            noiDung: [""],
        })
        this.getListDichVu();
        if (this.dataItem?.id > 0) {
            const input = new GetChuongTrinhTourByIdRequest();
            input.id = this.dataItem.id;
            ora.ui.setBusy();
            this._dataService.getchuongtrinhtourbyid(input).subscribe(res => {
                ora.ui.clearBusy();
                if (res.isSuccessful) {
                    this.dataItem = res.dataResult;
                    this.rfForm.patchValue(res.dataResult);
                    this.listDichVuSelected = JSON.parse(res.dataResult.listDichVuJson) ?? [];
                } else {
                    ora.notify.error(res.errorMessage);
                }
            })
        }
    }

    getListDichVu() {
        this._commonService.getlistdichvu().subscribe(res => {
            this.listDichVu = res;
        })
    }

    handleAddDichVu(value: string[]) {
        this.listDichVuSelected = value;
    }

    isCheckDichVu(value: string) {
        return this.listDichVuSelected.indexOf(value) >= 0;
    }

    save() {
        if (this.rfForm.invalid) {
            for (let i in this.rfForm.controls) {
                this.rfForm.controls[i].markAsDirty();
                this.rfForm.controls[i].updateValueAndValidity();
            }
            ora.notify.error('Vui lòng xem lại thông tin!');
        } else {
            const input = new CreateOrUpdateChuongTrinhTourRequest();
            input.id = this.dataItem.id;
            Object.assign(input, this.rfForm.value);
            input.tourSanPhamId = this.dataItem.tourSanPhamId;
            input.listDichVuJson = JSON.stringify(this.listDichVuSelected);
            input.ngayThu = this.dataItem.ngayThu;
            this._dataService.createorupdatechuongtrinhtour(input).subscribe(res => {
                if (res.isSuccessful) {
                    this.success();
                } else {
                    ora.notify.error(res.errorMessage);
                }
            })
        }
    }
}