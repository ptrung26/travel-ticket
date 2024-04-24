import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import { NzLayoutModule } from '@node_modules/ng-zorro-antd/layout';
import { NzSwitchModule } from '@node_modules/ng-zorro-antd/switch';
import { CustomizeCompModule } from '@shared/customize-comp/customize-comp.module';
import { OraTableModule } from '@shared/customize-comp/ora-table/ora-table.module';
import { DataCommonModule } from '@shared/data-common/data-common.module';
import { SharedModule } from '@shared/shared.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { DanhMucRoutingModule } from './danh-muc-routing.module';
import { DashboardDanhMucComponent } from './dashboard/dashboard-danh-muc.component';
import { NzUploadModule } from '@node_modules/ng-zorro-antd/upload';
import { SharedComponentModule } from '@app/shared/directives/shared-component.module';
import { NhaCungCapComponent } from './nha-cung-cap/nha-cung-cap.component';
import { CreateOrEditHuyenComponent } from '@app/routes/pages/danh-muc/huyen/create-or-edit.component';
import { HuyenComponent } from '@app/routes/pages/danh-muc/huyen/huyen.component';
import { UpLoadHuyenComponent } from '@app/routes/pages/danh-muc/huyen/up-load-huyen/up-load-huyen.component';
import { CreateOrEditQuocTichComponent } from '@app/routes/pages/danh-muc/quoc-tich/create-or-edit.component';
import { QuocTichComponent } from '@app/routes/pages/danh-muc/quoc-tich/quoc-tich.component';
import { UpLoadQuocTichModalComponent } from '@app/routes/pages/danh-muc/quoc-tich/up-load-quoc-tich-modal/up-load-modal.component';
import { CreateOrEditTinhComponent } from '@app/routes/pages/danh-muc/tinh/create-or-edit.component';
import { TinhComponent } from '@app/routes/pages/danh-muc/tinh/tinh.component';
import { UpLoadTinhComponent } from '@app/routes/pages/danh-muc/tinh/up-load-tinh/up-load-tinh.component';
import { CreateOrEditXaComponent } from '@app/routes/pages/danh-muc/xa/create-or-edit.component';
import { UpLoadXaModalComponent } from '@app/routes/pages/danh-muc/xa/up-load-xa-modal/up-load-xa-modal.component';
import { XaComponent } from '@app/routes/pages/danh-muc/xa/xa.component';
import { CreateOrEditNhaCungCapComponent } from './nha-cung-cap/create-or-edit-nha-cung-cap/create-or-edit-nha-cung-cap.component';
import { CauHinhChungComponent } from './cau-hinh-chung/cau-hinh-chung.component';
import { UploadDanhMucComponent } from './danh-muc-chung/up-load-danh-muc/upload-danh-muc.component';
import { CreateOrEditDanhMucComponent } from './danh-muc-chung/create-or-edit.component';
import { LoaiDanhMucCellComponent } from './danh-muc-chung/loai-danh-muc-cell/loai-danh-muc-cell.component';
import { DsThietBiThuocHeMayModalComponent } from './danh-muc-chung/loai-danh-muc-cell/ds-thiet-bi-thuoc-he-may-modal/ds-thiet-bi-thuoc-he-may-modal.component';
import { CreateOrEditCauHinhChungComponent } from './cau-hinh-chung/create-or-edit.component';
import { DanhMucComponent } from './danh-muc-chung/danh-muc.component';
import { NhaCungCapKhachSanComponent } from './nha-cung-cap/khach-san/nha-cung-cap-khach-san.component';
import { CreateOrUpdateKhachSanComponent } from './nha-cung-cap/khach-san/create-or-update/create-or-update-khach-san.component';
import { LienHeKhachSanComponent } from './nha-cung-cap/khach-san/lien-he/lien-he-khach-san.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DanhMucRoutingModule,
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
  ],
  declarations: [
    DashboardDanhMucComponent,
    NhaCungCapComponent,
    TinhComponent,
    CreateOrEditTinhComponent,
    UpLoadTinhComponent,
    HuyenComponent,
    CreateOrEditHuyenComponent,
    XaComponent,
    CreateOrEditXaComponent,
    UpLoadXaModalComponent,
    UpLoadHuyenComponent,
    QuocTichComponent,
    CreateOrEditQuocTichComponent,
    UpLoadQuocTichModalComponent,
    CreateOrEditNhaCungCapComponent,
    CauHinhChungComponent,
    UploadDanhMucComponent,
    CreateOrEditCauHinhChungComponent,
    CreateOrEditDanhMucComponent,
    LoaiDanhMucCellComponent,
    DsThietBiThuocHeMayModalComponent,
    DanhMucComponent,
    NhaCungCapKhachSanComponent,
    CreateOrUpdateKhachSanComponent,
    LienHeKhachSanComponent,
  ],
})
export class DanhMucModule {}
