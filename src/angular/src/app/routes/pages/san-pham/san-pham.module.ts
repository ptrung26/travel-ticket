import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentModule } from '@app/shared/directives/shared-component.module';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import { NzLayoutModule } from '@node_modules/ng-zorro-antd/layout';
import { NzSwitchModule } from '@node_modules/ng-zorro-antd/switch';
import { NzUploadModule } from '@node_modules/ng-zorro-antd/upload';
import { CustomizeCompModule } from '@shared/customize-comp/customize-comp.module';
import { OraTableModule } from '@shared/customize-comp/ora-table/ora-table.module';
import { DataCommonModule } from '@shared/data-common/data-common.module';
import { SharedModule } from '@shared/shared.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { SanPhamRoutingModule } from './san-pham-routing.module';
import { TourSanPhamComponent } from './tour-san-pham/tour-san-pham.component';
import { CrudTourSanPhamComponent } from './tour-san-pham/crud-tour-san-pham/crud-tour-san-pham.component';
import { ChuongTrinhTourComponent } from './tour-san-pham/chuong-trinh-tour/chuong-trinh-tour.component';
import { UpdateChuongTrinhTourComponent } from './tour-san-pham/chuong-trinh-tour/update-chuong-trinh-tour/update-chuong-trinh-tour.component';
import { ChietTinhXeComponent } from './tour-san-pham/chiet-tinh-tour/chiet-tinh-xe/chiet-tinh-xe.component';
import { CauHinhChietTinhTour } from './tour-san-pham/chiet-tinh-tour/cau-hinh-chiet-tinh-tour.component';
import { CrudChietTinhXeComponent } from './tour-san-pham/chiet-tinh-tour/chiet-tinh-xe/crud-chiet-tinh-xe/crud-chiet-tinh-xe.component';
import { SelectDichVuXeComponent } from './tour-san-pham/chiet-tinh-tour/chiet-tinh-xe/select-dich-vu-xe/select-dich-vu-xe.component';
import { ChietTinhVeComponent } from './tour-san-pham/chiet-tinh-tour/chiet-tinh-ve/chiet-tinh-ve.component';
import { CrudChietTinhVeComponent } from './tour-san-pham/chiet-tinh-tour/chiet-tinh-ve/crud-chiet-tinh-ve/crud-chiet-tinh-ve.component';
import { SelectDichVuVeComponent } from './tour-san-pham/chiet-tinh-tour/chiet-tinh-ve/crud-chiet-tinh-ve/select-dich-vu-ve/select-dich-vu-ve.component';
import { ThongTinMoBanModalComponent } from './tour-san-pham/thong-tin-mo-ban-modal/thong-tin-mo-ban-modal.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OraTableModule,
    ReactiveFormsModule,
    CustomizeCompModule,
    NzListModule,
    NzDividerModule,
    DataCommonModule,
    FormsModule,
    NzLayoutModule,
    NzSwitchModule,
    NzUploadModule,
    SharedComponentModule,
    SanPhamRoutingModule
  ],
  declarations: [
    TourSanPhamComponent,
    CrudTourSanPhamComponent,
    ChuongTrinhTourComponent,
    UpdateChuongTrinhTourComponent,
    ChietTinhXeComponent,
    CauHinhChietTinhTour,
    CrudChietTinhXeComponent,
    SelectDichVuXeComponent,
    ChietTinhVeComponent,
    CrudChietTinhVeComponent,
    SelectDichVuVeComponent,
    ThongTinMoBanModalComponent
  ],
})
export class SanPhamModule { }
