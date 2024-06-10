import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ChuongTrinhTourDto, GetChuongTrinhTourByIdRequest, GetTourSanPhamByIdRequest, PagingListChuongTrinhTourRequest, TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { UserSessionDto } from "@app/shared/service-proxies/tai-khoan-service-proxies";
import { ReuseTabService } from "@delon/abc/reuse-tab";
import { TitleService } from "@delon/theme";
import { ThanhTienKhoangNguoi } from "../../san-pham/tour-san-pham/chiet-tinh-tour/chiet-tinh-xe/chiet-tinh-xe.component";
import { KhoangNguoi } from "../../booking/crud-booking/dich-vu-booking-tour/crud-dich-vu-booking-tour/crud-dich-vu-booking-tour.component";
import { DateTime } from 'luxon';

export class ThongTinBooking {
    khachHangId?: number;
    quocGiaId: string;
    tenKhachHang: string;
    email: string;
    diaChi: string;
    soDienThoai: string;
    tourId: number;
    maTour: string;
    tenTour: string;
    urlAnhBia: string;
    soLuongNguoiLon: number;
    ngayBatDau: DateTime;
    donGia: number;
    sysUerId?: number;
}

@Component({
    selector: 'chi-tiet-san-pham',
    templateUrl: './chi-tiet-sp.component.html',
    styleUrls: ['./chi-tiet-sp.component.scss'],
})
export class ChiTietSanPhamComponent implements OnInit {
    tour: TourSanPhamDto;
    chuongTrinhTour: ChuongTrinhTourDto[] = [];
    collapseChuongTrinh: {
        name: string;
        content: string;
        active: boolean
    }[] = [];
    rfForm: FormGroup;
    userSession: UserSessionDto;
    id: string;
    khoangNguoi: KhoangNguoi[] = []
    donGia: number = 0;

    constructor(private fb: FormBuilder, private router: Router, private reuseTabService: ReuseTabService, private titleSrv: TitleService,
        private route: ActivatedRoute, private _dataService: TourSanPhamServiceProxy
    ) {
        this.rfForm = this.fb.group({
            ngayBatDau: [null],
            soLuongNguoiLon: [1, [Validators.required]],
        })


    }

    ngOnInit(): void {
        this.reuseTabService.title = "Chi tiết sản phẩm";
        this.titleSrv.setTitle("Chi tiết sản phẩm");
        this.userSession = JSON.parse(sessionStorage.getItem('userSession'));
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
            if (+this.id > 0) {
                const input = new GetTourSanPhamByIdRequest();
                input.id = +this.id;
                ora.ui.setBusy();
                this._dataService.getbyid(input).subscribe(res => {
                    if (res.isSuccessful) {
                        this.tour = res.dataResult;
                        const ctTour = new PagingListChuongTrinhTourRequest();
                        ctTour.tourSanPhamId = +this.id;
                        ctTour.maxResultCount = 100;
                        ctTour.skipCount = 0;
                        ctTour.tourSanPhamId = +this.id;
                        this._dataService.getchuongtrinhtour(ctTour).subscribe(res => {
                            ora.ui.clearBusy();
                            this.chuongTrinhTour = res.items;
                            this.chuongTrinhTour.forEach(el => {
                                this.collapseChuongTrinh.push({
                                    name: `Ngày ${el.ngayThu}: ${el.tenHanhTrinh}`,
                                    content: el.noiDung,
                                    active: true,
                                })

                            });
                        })

                        const khoangNguoiArr = JSON.parse(this.tour.thanhTienKhoangNguoiJson) as ThanhTienKhoangNguoi[];
                        this.processKhoangNguoiArr(khoangNguoiArr);
                    }
                })
            }
        });

        this.rfForm.get("soLuongNguoiLon").valueChanges.subscribe(val => {
            let giaNett = 0;
            console.log(val, this.khoangNguoi);
            for (let i = this.khoangNguoi.length - 1; i >= 0; i--) {
                if (+val >= +this.khoangNguoi[i].khoangNguoi) {
                    giaNett = this.khoangNguoi[i].giaNett;
                    break;
                }
            }

            if (giaNett > 0) {
                this.donGia = giaNett;
            }

        })


    }

    processKhoangNguoiArr(khoangNguoiArr: ThanhTienKhoangNguoi[]) {
        khoangNguoiArr.forEach(it => {
            let kn: KhoangNguoi = {
                khoangNguoi: 0,
                khoangNguoiCode: "",
                giaNett: 0,
            };
            switch (it.khoangNguoiCode) {
                case "1Nguoi": {
                    kn.khoangNguoi = 1;
                    break;
                }
                case "5Nguoi": {
                    kn.khoangNguoi = 5;
                    break;
                }
                case "10Nguoi": {
                    kn.khoangNguoi = 10;
                    break;
                }
            }
            kn.khoangNguoiCode = it.khoangNguoiCode;
            kn.giaNett = it.thanhTien;
            this.khoangNguoi.push(kn);
        });
        this.khoangNguoi.sort((a, b) => a.khoangNguoi - b.khoangNguoi);
        this.donGia = this.khoangNguoi[0].giaNett;

    }

    bookingTour() {
        // if (!this.userSession?.sysUserId) {
        //     this.router.navigateByUrl('/account/login', {
        //         replaceUrl: true,
        //         state: { redirect: this.router.url }
        //     });

        // } else {

        // }

        const thongTinBooking = Object.assign(new ThongTinBooking(), this.rfForm.value);
        thongTinBooking.donGia = this.donGia;
        thongTinBooking.tenTour = this.tour.ten;
        thongTinBooking.urlAnhBia = this.tour.urlAnhBia;
        thongTinBooking.maTour = this.tour.ma;
        sessionStorage.setItem("thongTinBooking", JSON.stringify(thongTinBooking));
        this.router.navigateByUrl('payment/new');

    }
}