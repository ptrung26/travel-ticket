import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DichVuXeDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { ChietTinhXeDto, CreateOrUpdateChietTinhXeRequest, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'crud-chiet-tinh-xe',
    templateUrl: './crud-chiet-tinh-xe.component.html'
})
export class CrudChietTinhXeComponent implements OnInit {
    @Input() data: ChietTinhXeDto[] = [];
    @Input() listKhoangNguoi: any;
    @Input() listGroupTheoNgay: [];
    @Output() closeEvent = new EventEmitter<boolean>();
    rfForm: FormGroup;
    dichVu: DichVuXeDto;

    constructor(private fb: FormBuilder, private _dataService: TourSanPhamServiceProxy) {
        this.rfForm = this.fb.group({
            listChietTinhXe: this.fb.array([]),
        });

    }

    get listChietTinh(): FormArray {
        return this.rfForm.get("listChietTinhXe") as FormArray;
    }

    ngOnInit(): void {
        if (this.data.length > 0) {
            for (let i = 0; i < Object.keys(this.listKhoangNguoi).length; ++i) {
                const item = this.data[i];
                this.listChietTinh.push(this.fb.group({
                    khoangKhachCode: item.khoangKhachCode,
                    khoangKhachDisplay: item.khoangKhachDisplay,
                    nhaCungCapId: item.nhaCungCapId,
                    dichVuXeId: item.dichVuXeId,
                    tenDichVu: item.tenDichVu,
                    giaNett: item.giaNett,
                    isHasThueVAT: [{ value: item.isHasThueVAT, disabled: true }],
                    tongChiPhi: (item.giaNett * (item.isHasThueVAT ? 1 : 1.1)).toFixed(0)
                }))
            }

        } else {
            this.listChietTinh.push(this.fb.group({
                khoangKhachCode: [""],
                khoangKhachDisplay: [""],
                nhaCungCapId: [null],
                dichVuXeId: [null],
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

    luaChon(data: DichVuXeDto, i: number) {
        this.dichVu = data;
        this.listChietTinh.controls[i].get("tenDichVu").setValue(data.ten);
        this.listChietTinh.controls[i].get("dichVuXeId").setValue(data.id);
        this.listChietTinh.controls[i].get("nhaCungCapId").setValue(data.nhaCungCapXeId);
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
        const input = new CreateOrUpdateChietTinhXeRequest();
        const listCT: ChietTinhXeDto[] = [];
        for (let item of this.rfForm.get("listChietTinhXe").value) {
            const ctx = new ChietTinhXeDto();
            Object.assign(ctx, item);
            listCT.push(ctx);
        }

        const listChietTinhXe: ChietTinhXeDto[] = [];
        for (let item of this.data) {
            const matchValues = listCT.filter(x => x.khoangKhachCode == item.khoangKhachCode);
            if (matchValues.length > 0) {
                item.dichVuXeId = matchValues[0].dichVuXeId;
                item.nhaCungCapId = matchValues[0].nhaCungCapId;
                item.giaNett = matchValues[0].giaNett;
                item.tenDichVu = matchValues[0].tenDichVu;
                item.tongChiPhi = matchValues[0].tongChiPhi;
                item.nhaCungCapId = matchValues[0].nhaCungCapId;
                item.tenNhaCungCap = matchValues[0].tenNhaCungCap;
                item.isHasThueVAT = matchValues[0].isHasThueVAT;
                listChietTinhXe.push(item);
            }
        }

        input.listChietTinhXe = listChietTinhXe;
        ora.ui.setBusy();
        this._dataService.createorupdatechiettinhxe(input).pipe(finalize(() => {
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