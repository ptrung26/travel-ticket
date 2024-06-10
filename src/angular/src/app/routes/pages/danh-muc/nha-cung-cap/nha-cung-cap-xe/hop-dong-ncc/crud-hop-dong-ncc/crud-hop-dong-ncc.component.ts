import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CreateOrUpdateHopDongNCCRequest, HopDongNCCDto, HopDongNccServiceProxy } from "@app/shared/service-proxies/danh-muc-service-proxies";

@Component({
    selector: 'crud-hop-dong-ncc',
    templateUrl: './crud-hop-dong-ncc.component.html',
})
export class CrudHopDongXeComponent implements OnInit {
    title: string = "Thêm mới hợp đồng";
    rfForm: FormGroup;
    @Input() id?: number;
    @Input() nhaCungCapId: number;
    @Output() closeEvent = new EventEmitter();
    data: HopDongNCCDto;
    constructor(private fb: FormBuilder, private _dataService: HopDongNccServiceProxy) {
        this.rfForm = this.fb.group({
            ma: ["", [Validators.required]],
            ngayKy: [null, [Validators.required]],
            ngayHetHan: [null, [Validators.required]],
            loaiHopDongCode: [""],
            nguoiTaoHopDong: [""],
            moTa: [""],
        })
    }


    ngOnInit(): void {
        if (this.id) {
            this.title = "Sửa hợp đồng";
        }
    }

    close() {
        this.closeEvent.emit();
    }

    save() {
        if (this.rfForm.invalid) {
            for (let i in this.rfForm.controls) {
                this.rfForm.controls[i].markAsDirty();
                this.rfForm.controls[i].updateValueAndValidity();
            }
            ora.notify.error('Vui lòng xem lại thông tin!');
        } else {
            const input = new CreateOrUpdateHopDongNCCRequest();
            Object.assign(input, this.rfForm.value);
            this._dataService.createorupdatehopdongncc(input).subscribe(res => {
                if (res.isSuccessful) {
                    if (this.id) {
                        ora.notify.success("Chỉnh sửa hợp đồng thành công");
                    } else {
                        ora.notify.success("Thêm mới hợp đồng thành công");
                    }
                    this.close();
                } else {
                    ora.notify.error(res.errorMessage);
                }
            })
        }
    }
}