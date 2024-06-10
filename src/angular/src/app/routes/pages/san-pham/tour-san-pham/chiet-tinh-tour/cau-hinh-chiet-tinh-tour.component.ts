import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CreateOrUpdateTourSanPhamRequest, GetTourSanPhamByIdRequest, TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { ChietTinhXeComponent, ThanhTienKhoangNguoi } from "./chiet-tinh-xe/chiet-tinh-xe.component";
import { finalize } from "rxjs/operators";
import { ChietTinhVeComponent } from "./chiet-tinh-ve/chiet-tinh-ve.component";


@Component({
    selector: 'cau-hinh-chiet-tinh-tour',
    templateUrl: './cau-hinh-chiet-tinh-tour.component.html',
    styleUrls: ['./cau-hinh-chiet-tinh-tour.component.scss']
})
export class CauHinhChietTinhTour implements OnInit {
    @Input() id: number;
    @Output() closeEvent = new EventEmitter();
    data: TourSanPhamDto;
    title: string = "Bảng chiết tính";
    listKhoangNguoi: Partial<ThanhTienKhoangNguoi> = {};
    isChanged: boolean = false;
    @ViewChild('ctxe') ctXe: ChietTinhXeComponent;
    @ViewChild('ctve') ctVe: ChietTinhVeComponent;
    tongTien1Nguoi: number = 0;

    constructor(private _dataService: TourSanPhamServiceProxy) {

    }

    ngOnInit(): void {
        const input = new GetTourSanPhamByIdRequest();
        input.id = this.id;
        this._dataService.getbyid(input).subscribe(res => {
            if (res.isSuccessful) {
                this.data = res.dataResult;
                if (this.data.thanhTienKhoangNguoiJson) {
                    const thanhTien: ThanhTienKhoangNguoi[] = JSON.parse(this.data.thanhTienKhoangNguoiJson) as ThanhTienKhoangNguoi[];
                    const khoangNguoi1 = thanhTien?.find(x => x.khoangNguoiCode == "1Nguoi");
                    if (khoangNguoi1) {
                        this.tongTien1Nguoi = khoangNguoi1.thanhTien;
                    }
                }
                this.title = `Bảng chiết tính: ${this.data.ten}(${this.data.soNgay}n/${this.data.soDem}đ)`;
            } else {
                ora.notify.error(res.errorMessage);
            }
        })
    }

    isExistDichVu(code: string): boolean {
        if (!this.data) {
            return false;
        }
        return this.data?.listDichVu?.filter(x => x.dichVuCode == code).length > 0;
    }

    close() {
        this.closeEvent.emit();
    }

    calTongTienDon(data: ThanhTienKhoangNguoi[]) {
        this.isChanged = true;
        this.title = `Bảng chiết tính: ${this.data.ten}(${this.data.soNgay}n/${this.data.soDem}đ)`;
        data.forEach(item => {
            if (!this.listKhoangNguoi[item.khoangNguoiCode]) {
                this.listKhoangNguoi[item.khoangNguoiCode] = 0;
            }

            this.listKhoangNguoi[item.khoangNguoiCode] += item.thanhTien;
        });

    }

    calTongTien() {
        this.listKhoangNguoi = {};

        // Lấy thông tin 
        if (this.ctVe) {
            this.ctVe.isChanged = true;
            this.ctVe.calTongTienTour();
        }
        if (this.ctXe) {
            this.ctXe.isChanged = true;
            this.ctXe.calTongTienTour();
        }

        const mapToNguoi: { [key: string]: string } = {
            'SoCho4': '1Nguoi',
            'SoCho10': '5Nguoi',
            'SoCho20': '10Nguoi'
        };
        const thanhTienKhoangNguoi: ThanhTienKhoangNguoi[] = [];
        Object.keys(this.listKhoangNguoi).forEach(key => {
            thanhTienKhoangNguoi.push({
                khoangNguoiCode: key,
                thanhTien: this.listKhoangNguoi[key],
            })
        });

        const map = thanhTienKhoangNguoi.reduce((acc, curr) => {
            const khoangNguoiCode = mapToNguoi[curr.khoangNguoiCode] || curr.khoangNguoiCode;
            const existing = acc.find(item => item.khoangNguoiCode === khoangNguoiCode);
            if (existing) {
                existing.thanhTien += curr.thanhTien;
            } else {
                acc.push({ khoangNguoiCode, thanhTien: curr.thanhTien });
            }

            return acc;
        }, [] as ThanhTienKhoangNguoi[]);

        const khoangNguoi1 = map.find(x => x.khoangNguoiCode == "1Nguoi");
        if (khoangNguoi1) {
            this.tongTien1Nguoi = khoangNguoi1.thanhTien;
        }

        this.data.thanhTienKhoangNguoiJson = JSON.stringify(map);
        const input = new CreateOrUpdateTourSanPhamRequest();
        Object.assign(input, this.data);
        ora.ui.setBusy();
        this._dataService.createorupdate(input).pipe(finalize(() => {
            ora.ui.clearBusy();
        })).subscribe(res => {
            if (res.isSuccessful) {
                ora.notify.success("Cập nhật giá tour thành công");
                this.isChanged = false;
            } else {
                ora.notify.error(res.errorMessage);
            }
        })
    }

}