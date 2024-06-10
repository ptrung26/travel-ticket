import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DichVuVeDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { ChietTinhVeDto, CreateOrUpdateChietTinhVeRequest, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'crud-chiet-tinh-ve',
    templateUrl: './crud-chiet-tinh-ve.component.html'
})
export class CrudChietTinhVeComponent implements OnInit {
    @Input() data: ChietTinhVeDto[] = [];
    @Input() listKhoangNguoi: any;
    @Input() listGroupTheoNgay: [];
    @Output() closeEvent = new EventEmitter<boolean>();
    rfForm: FormGroup;
    dichVu: DichVuVeDto;

    constructor(private fb: FormBuilder, private _dataService: TourSanPhamServiceProxy) {
        this.rfForm = this.fb.group({
            listChietTinhVe: this.fb.array([]),
        });

    }

    get listChietTinh(): FormArray {
        return this.rfForm.get("listChietTinhVe") as FormArray;
    }

    ngOnInit(): void {
        if (this.data.length > 0) {
            for (let i = 0; i < Object.keys(this.listKhoangNguoi).length; ++i) {
                const item = this.data[i];
                this.listChietTinh.push(this.fb.group({
                    khoangKhachCode: item.khoangKhachCode,
                    khoangKhachDisplay: item.khoangKhachDisplay,
                    nhaCungCapId: item.nhaCungCapId,
                    dichVuVeId: item.dichVuVeId,
                    tenDichVu: item.tenDichVu,
                    giaNett: item.giaNett,
                    isHasThueVAT: [{ value: item.isHasThueVAT, disabled: true }],
                    tongChiPhi: (item.giaNett * (!item.isHasThueVAT ? 1 : 1.1)).toFixed(0)
                }))
            }

        } else {
            this.listChietTinh.push(this.fb.group({
                khoangKhachCode: [""],
                khoangKhachDisplay: [""],
                nhaCungCapId: [null],
                dichVuVeId: [null],
                tenDichVu: [""],
                giaNett: [null],
                isHasThueVAT: [{ value: false, disabled: true }],
                tongChiPhi: [0],
            }))
        }

        this.listChietTinh.controls.forEach((fg: FormGroup) => {
            fg.get("giaNett").valueChanges.subscribe(giaNett => {
                if (fg.get('isHasThueVAT').value == true) {
                    fg.get("tongChiPhi").setValue((giaNett * 1.1).toFixed(0));
                } else {
                    fg.get("tongChiPhi").setValue(giaNett);
                }
            })
        });

    }

    luaChon(data: DichVuVeDto, i: number) {
        this.dichVu = data;
        this.listChietTinh.controls[i].get("tenDichVu").setValue(data.ten);
        this.listChietTinh.controls[i].get("dichVuVeId").setValue(data.id);
        this.listChietTinh.controls[i].get("nhaCungCapId").setValue(data.nhaCungCapVeId);
        this.listChietTinh.controls[i].get("giaNett").setValue(data.giaNett);
        this.listChietTinh.controls[i].get("isHasThueVAT").setValue(data.isHasThueVAT);
        const giaNett = this.listChietTinh.controls[i].get("giaNett").value;
        if (this.listChietTinh.controls[i].get('isHasThueVAT').value == true) {
            this.listChietTinh.controls[i].get("tongChiPhi").setValue((giaNett * 1.1).toFixed(0));
        } else {
            this.listChietTinh.controls[i].get("tongChiPhi").setValue(giaNett);
        }
    }

    save() {
        const input = new CreateOrUpdateChietTinhVeRequest();
        const listCT: ChietTinhVeDto[] = [];
        for (let item of this.rfForm.get("listChietTinhVe").value) {
            const ctx = new ChietTinhVeDto();
            Object.assign(ctx, item);
            listCT.push(ctx);
        }

        const listChietTinhVe: ChietTinhVeDto[] = [];
        for (let item of this.data) {
            const matchValues = listCT.filter(x => x.khoangKhachCode == item.khoangKhachCode);
            if (matchValues.length > 0) {
                item.dichVuVeId = matchValues[0].dichVuVeId;
                item.nhaCungCapId = matchValues[0].nhaCungCapId;
                item.giaNett = matchValues[0].giaNett;
                item.tenDichVu = matchValues[0].tenDichVu;
                item.tongChiPhi = matchValues[0].tongChiPhi;
                item.nhaCungCapId = matchValues[0].nhaCungCapId;
                item.tenNhaCungCap = matchValues[0].tenNhaCungCap;
                item.isHasThueVAT = matchValues[0].isHasThueVAT;
                listChietTinhVe.push(item);
            }
        }

        input.listChietTinhVe = listChietTinhVe;
        ora.ui.setBusy();
        this._dataService.createorupdatechiettinhve(input).pipe(finalize(() => {
            ora.ui.clearBusy();
        })).subscribe(res => {
            if (res.isSuccessful) {
                ora.notify.success("Chiết tính dịch vụ xe thành công");
                this.close(true);
            } else {
                ora.notify.error(res.errorMessage);
            }
        })
    }

    close(isSaved?: boolean) {
        this.closeEvent.emit(isSaved);
    }


}