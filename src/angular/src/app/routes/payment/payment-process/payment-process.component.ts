import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ThongTinBooking } from "@app/routes/pages/home/chi-tiet-sp/chi-tiet-sp.component";
import { BookingServiceProxy, CreateOrUpdatThongTinBookingDto, CreateOrUpdateBookingRequest, CreateOrUpdateDichVuBookingTourDto, CrudChiTietDichVuBookingTour } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'payment-process',
    templateUrl: './payment-process.component.html',
    styleUrls: ['./payment-process.component.scss'],
})
export class PaymentProcess implements OnInit {
    isNavigate: boolean = false;
    constructor(private _bookingService: BookingServiceProxy, private router: Router) {

    }

    ngOnInit(): void {
        const bookinginfo: ThongTinBooking = JSON.parse(localStorage.getItem("bookingInfo")) as ThongTinBooking;
        localStorage.removeItem("bookingInfo");

        const input = new CreateOrUpdateBookingRequest();
        input.booking = new CreateOrUpdatThongTinBookingDto();
        input.tour = new CreateOrUpdateDichVuBookingTourDto();

        // Thông tin chung 
        input.booking.tenKhachHang = bookinginfo.tenKhachHang;
        input.booking.diaChi = bookinginfo.diaChi;
        input.booking.email = bookinginfo.email;
        input.booking.soDienThoai = bookinginfo.soDienThoai;
        input.booking.sysUerId = bookinginfo.sysUerId;
        input.booking.nhanVienId = 1;
        input.booking.ten = bookinginfo.tenTour;

        // Chi tiết dịch vu tour 
        input.tour.tourId = bookinginfo.tourId;
        input.tour.soLuongNguoiLon = bookinginfo.soLuongNguoiLon;
        input.tour.ngayBatDau = bookinginfo.ngayBatDau;
        input.tour.tenTour = bookinginfo.tenTour;

        const ct = new CrudChiTietDichVuBookingTour();
        ct.giaBan = bookinginfo.donGia;
        ct.loaiDoTuoi = "Người lớn";
        ct.giaNett = bookinginfo.donGia;
        ct.thanhTien = bookinginfo.donGia * bookinginfo.soLuongNguoiLon;
        ct.soLuong = bookinginfo.soLuongNguoiLon;
        input.tour.listChiTiet = [];
        input.tour.listChiTiet.push(ct);

        ora.ui.setBusy();
        this._bookingService.createorupdate(input).pipe(finalize(() => {
            ora.ui.clearBusy();
        })).subscribe(res => {
            this.isNavigate = true;
            if (res.isSuccessful) {
                ora.notify.success("Tạo booking thành công!");
            } else {
                ora.notify.error(res.errorMessage);
            }

            setTimeout(() => {
                this.router.navigateByUrl("/home");
            }, 2000);
        })
    }

}