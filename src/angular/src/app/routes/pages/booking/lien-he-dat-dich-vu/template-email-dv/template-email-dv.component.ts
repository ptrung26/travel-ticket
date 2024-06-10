import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalComponentBase } from "@app/shared/common/modal-component-base";
import { NhaCungCapDVNode } from "../../crud-booking/dich-vu-booking-le/dich-vu-booking-le.component";
import { BookingDto, BookingServiceProxy, GetBookingByIdRequest } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { finalize } from "rxjs/operators";
import { DateTime } from "luxon";

@Component({
    selector: 'template-email-dv',
    templateUrl: './template-email-dv.component.html'
})
export class TemplateEmailDVCompoennt extends ModalComponentBase implements OnInit {

    @Input() bookingId: number;
    @Input() dichVuNCC: NhaCungCapDVNode;
    booking: BookingDto;
    content: string = "";

    generateTemplateDatDV(): string {
        if (!this.booking || !this.dichVuNCC) {
            return "";
        }
        const dichVuTour = this.booking.dichVuBookingTour;
        const ngayBatDau: DateTime = DateTime.fromISO(dichVuTour.ngayBatDau);
        const ngayKetThuc: DateTime = ngayBatDau.plus({ days: dichVuTour.soNgay });

        let serviceDetails = '';
        let currentDate = ngayBatDau;
        for (const nhaCungCap of this.dichVuNCC.childrens) {
            serviceDetails += `<li>${currentDate.toFormat('dd/MM')}: ${nhaCungCap.tenDichVu}</li>`;
            currentDate = currentDate.plus({ days: 1 });
        }

        return `
        <h1>Liên hệ Đặt Dịch Vụ</h1>
        <p>Kính gửi Quý Công ty ${this.dichVuNCC.tenNhaCungCap},</p>
        <p>Công ty MTravel xin được đặt các dịch vụ từ ngày từ ngày <strong>${ngayBatDau.toFormat('dd/MM/yyyy')}</strong> đến ngày <strong>${ngayKetThuc.toFormat('dd/MM/yyyy')}</strong> với các chi tiết như sau:</p>
        <ul>
            ${serviceDetails}
        </ul>
        <p>Rất mong nhận được sự phản hồi từ Quý công ty.</p>
        <p>Trân trọng,</p>
        <p><strong>MTravel</strong></p>
        <p>Email: info@mtravel.com | Điện thoại: 0123-456-789</p>
        <p>Địa chỉ: 123 Đường ABC, Thành phố Hà Nội</p>
    `;

    }

    constructor(injector: Injector, private _bookingService: BookingServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.bookingId > 0) {
            const input = new GetBookingByIdRequest();
            input.id = this.bookingId;
            ora.ui.setBusy();
            this._bookingService.getbyid(input).pipe(finalize(() => {
                ora.ui.clearBusy();
            })).subscribe(res => {
                if (res.isSuccessful) {
                    this.booking = res.dataResult;
                    this.content = this.generateTemplateDatDV();
                } else {
                    ora.notify.error(res.errorMessage);
                }
            })
        }
    }




}