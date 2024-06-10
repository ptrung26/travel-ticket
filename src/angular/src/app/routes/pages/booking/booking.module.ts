import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CongViecRoutingModule } from '@app/routes/pages/cong-viec/cong-viec-routing.module';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { OraTableModule } from '@app/shared/customize-comp/ora-table/ora-table.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { FullCalendarModule } from '@node_modules/@fullcalendar/angular';
import { NzListModule } from '@node_modules/ng-zorro-antd/list';
import { NzTagModule } from '@node_modules/ng-zorro-antd/tag';
import { SharedModule } from '@shared/shared.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { CrudBookingComponent } from './crud-booking/crud-booking.component';
import { SelectKhachHangComponent } from './crud-booking/thong-tin-chung/select-khach-hang/select-khach-hang.component';
import { ThongTinChungBookingComponent } from './crud-booking/thong-tin-chung/thong-tin-chung-booking.component';
import { DichVuBookingTourComponent } from './crud-booking/dich-vu-booking-tour/dich-vu-booking-tour.component';
import { CrudDichVuBookingTourComponent } from './crud-booking/dich-vu-booking-tour/crud-dich-vu-booking-tour/crud-dich-vu-booking-tour.component';
import { CreateOrUpdateThanhVienDoanComponent } from './chi-tiet-thanh-vien-doan/crud/crud-thanh-vien-doan.component';
import { ChiTietThanhVienDoanComponent } from './chi-tiet-thanh-vien-doan/chi-tiet-thanh-vien-doan.component';
import { ChiTietPhieuThuChiComponent } from './chi-tiet-phieu-chi-thu/chi-tiet-phieu-thu-chi.component';
import { TemplateEmailDVCompoennt } from './lien-he-dat-dich-vu/template-email-dv/template-email-dv.component';
import { LienHeDatDichVuComponent } from './lien-he-dat-dich-vu/lien-he-dat-dich-vu.component';
import { DichVuBookingLeComponent } from './crud-booking/dich-vu-booking-le/dich-vu-booking-le.component';

@NgModule({
    imports: [
        CommonModule,
        CongViecRoutingModule,
        NzTagModule,
        SharedModule,
        NzListModule,
        OraTableModule,
        ReactiveFormsModule,
        CustomizeCompModule,
        NzDividerModule,
        DataCommonModule,
        FormsModule,
        NzModalModule,
        FullCalendarModule,
        BookingRoutingModule
    ],
    declarations: [BookingComponent,
        CrudBookingComponent,
        ThongTinChungBookingComponent,
        SelectKhachHangComponent,
        DichVuBookingTourComponent,
        CrudDichVuBookingTourComponent,
        CreateOrUpdateThanhVienDoanComponent,
        ChiTietThanhVienDoanComponent,
        ChiTietPhieuThuChiComponent,
        TemplateEmailDVCompoennt,
        LienHeDatDichVuComponent,
        DichVuBookingLeComponent, 
    ],
})
export class BookingModule { }
