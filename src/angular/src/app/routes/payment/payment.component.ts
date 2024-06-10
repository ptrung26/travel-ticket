import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { CreatePaymentVNPayRequest, ThanhToanServiceProxy } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { TitleService } from "@delon/theme";
import _ from "lodash";
import { DateTime } from 'luxon';
import { ThongTinBooking } from "../pages/home/chi-tiet-sp/chi-tiet-sp.component";
import { TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { finalize } from "rxjs/operators";
import { AppConsts } from "@app/shared/AppConsts";
import { ApiNameConfig } from "@app/shared/service-proxies/service-url-config/url-services";
import { HttpClient } from "@angular/common/http";
@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
    isCamKet: boolean = false;
    rfForm: FormGroup;
    bookingInfo: ThongTinBooking;
    imageUrl: string = "";
    constructor(private fb: FormBuilder, private router: Router, private titleSrv: TitleService,
        private _paymentService: ThanhToanServiceProxy, private _tourSanPhamService: TourSanPhamServiceProxy, private _httpClient: HttpClient) {
        this.rfForm = this.fb.group({
            tenKhachHang: [""],
            email: ["",],
            diaChi: [""],
            soDienThoai: [""],
            ngayBatDau: [DateTime.now()],

        })
    }
    ngOnInit(): void {
        ora.ui.setBusy();
        this.titleSrv.setTitle("Chi tiết phiếu thanh toán");
        this.bookingInfo = JSON.parse(sessionStorage.getItem("thongTinBooking")) as ThongTinBooking;
        this.viewImageInit();
    }

    viewImageInit() {
        const type = this.getFileType();
        this._tourSanPhamService
            .viewimage(this.bookingInfo.urlAnhBia, type)
            .pipe(
                finalize(() => {
                    ora.ui.clearBusy();
                }),
            )
            .subscribe((res) => {
                ora.ui.clearBusy();
                if (res.isSuccessful) {
                    const imageViewUrl = AppConsts.abpEnvironment.apis.sanPham.url + `/api/${ApiNameConfig.sanPham.apiName}/file/gotoview/${res.dataResult.fileToken}`;

                    this._httpClient.get(imageViewUrl, { responseType: 'arraybuffer' })
                        .subscribe((data) => {
                            const blob = new Blob([data], { type: res.dataResult.fileType });
                            const reader = new FileReader();

                            reader.onloadend = () => {
                                this.imageUrl = reader.result as string;
                            };

                            reader.readAsDataURL(blob);

                        });
                }
            })
    }

    getFileType() {
        return this.bookingInfo.urlAnhBia.substring(this.bookingInfo.urlAnhBia.lastIndexOf('.') + 1);
    }


    createPayment() {
        const userSession = JSON.parse(sessionStorage.getItem('userSession'));
        if (!userSession || !userSession.userId) {
            sessionStorage.setItem('redirectAfterLogin', JSON.stringify({ url: this.router.url }));
            this.router.navigate(['/account/login']);
            return;
        }
        const input = new CreatePaymentVNPayRequest();
        const formValue = this.rfForm.value;
        Object.assign(input, formValue);
        input.tourId = this.bookingInfo.tourId;
        input.thanhTien = this.bookingInfo.donGia * this.bookingInfo.soLuongNguoiLon;
        input.gia = this.bookingInfo.donGia;
        input.soLuongNguoiLon = this.bookingInfo.donGia;

        // Set khách hàng với user tương ứng 
        this.bookingInfo.sysUerId = userSession.sysUserId;
        Object.assign(this.bookingInfo, formValue);
        localStorage.setItem("bookingInfo", JSON.stringify(this.bookingInfo));

        this._paymentService.payment(input).subscribe(res => {
            if (res.isSuccessful) {
                window.location.href = res.dataResult;
            }
        })
    }
}