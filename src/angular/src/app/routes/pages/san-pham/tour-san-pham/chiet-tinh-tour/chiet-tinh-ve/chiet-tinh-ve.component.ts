import { Component, EventEmitter, Injector, Input, OnInit, Output } from "@angular/core";
import { AppComponentBase } from "@app/shared/common/AppComponentBase";
import { ChietTinhVeDto, GetListChietTinhVeRequest, TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { ThanhTienKhoangNguoi } from "../chiet-tinh-xe/chiet-tinh-xe.component";



@Component({
    selector: 'chiet-tinh-ve',
    templateUrl: './chiet-tinh-ve.component.html'
})
export class ChietTinhVeComponent extends AppComponentBase implements OnInit {
    @Input() tourSanPham: TourSanPhamDto;
    @Output() crudChiTiet = new EventEmitter<ThanhTienKhoangNguoi[]>();
    listKhoangNguoi = {}
    listGroupTheoNgay = [];
    data: ChietTinhVeDto[] = [];
    thanhTienKhoangNguoi: ThanhTienKhoangNguoi[] = [];
    viewShow: 'list' | 'crud-chiet-tinh-ve' = 'list';
    isChanged: boolean = false;
    constructor(injector: Injector, private _dataService: TourSanPhamServiceProxy) {
        super(injector);
    }
    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.thanhTienKhoangNguoi = [];
        this.listKhoangNguoi = {};
        this.listGroupTheoNgay = [];
        const input = new GetListChietTinhVeRequest();
        input.tourSanPhamId = this.tourSanPham.id;
        this._dataService.getlistchiettinhve(input).subscribe(res => {
            if (res.isSuccessful) {
                this.data = res.dataResult;
                this.getListKhoangNguoi();
                this.groupTheoNgay();
                this.calTongTienTour();
            } else {
                ora.notify.error(res.errorMessage);
            }
        })
    }

    log(val: any) {
        console.log(val);
    }

    calTongTienTour() {
        let khoangNguoi = {};
        this.thanhTienKhoangNguoi = [];
        for (let item of this.data) {
            if (!khoangNguoi[item.khoangKhachCode]) {
                khoangNguoi[item.khoangKhachCode] = 0;
            }
            let gia = (item.giaNett ?? 0) * (item.isHasThueVAT ? 1.1 : 1);
            khoangNguoi[item.khoangKhachCode] += gia ?? 0;
        }

        Object.keys(khoangNguoi).forEach(key => {
            this.thanhTienKhoangNguoi.push({
                khoangNguoiCode: key,
                thanhTien: khoangNguoi[key],
            })
        });
        if (this.isChanged) {
            this.crudChiTiet.emit(this.thanhTienKhoangNguoi);
        }
    }

    getTongTienTungKhoangKhach(khoangKhachDisplay: string): number {
        const khoangKhachMatch = this.data.find(x => x.khoangKhachDisplay === khoangKhachDisplay);
        if (!khoangKhachMatch) {
            return 0;
        }

        const khoangKhachCode = khoangKhachMatch.khoangKhachCode;
        const thanhTienMatch = this.thanhTienKhoangNguoi.find(x => x.khoangNguoiCode === khoangKhachCode);
        if (!thanhTienMatch) {
            return 0;
        }

        return thanhTienMatch.thanhTien;

    }

    getListKhoangNguoi() {
        for (let item of this.data) {
            this.listKhoangNguoi[item.khoangKhachDisplay] = 0;
        }
    }

    get listKhoangNguoiArr(): string[] {
        return Object.keys(this.listKhoangNguoi);
    }

    groupTheoNgay() {
        if (!this.data.length) {
            return []
        }

        let ngayTour = {};
        this.data.forEach(item => {
            if (!ngayTour[item.ngayThu.toString()]) {
                ngayTour[item.ngayThu.toString()] = [];
            }
            ngayTour[item.ngayThu.toString()].push(item);
        });

        Object.keys(ngayTour).forEach(ngay => {
            this.listGroupTheoNgay.push({
                ngay: ngay,
                listChietTinh: ngayTour[ngay],
            })
        })
    }

    cauHinh() {
        this.viewShow = 'crud-chiet-tinh-ve';
    }

    thayDoiView(val?: boolean) {
        this.viewShow = 'list';
        if (val) {
            this.isChanged = true;
            this.refresh();
        }
    }

}