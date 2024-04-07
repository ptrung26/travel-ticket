import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import { NzLayoutModule } from '@node_modules/ng-zorro-antd/layout';
import { NzSwitchModule } from '@node_modules/ng-zorro-antd/switch';
import { BaseServiceProxies } from '@service-proxies/base-service-proxies.service';
import { CustomizeCompModule } from '@shared/customize-comp/customize-comp.module';
import { OraTableModule } from '@shared/customize-comp/ora-table/ora-table.module';
import { DataCommonModule } from '@shared/data-common/data-common.module';
import { SharedModule } from '@shared/shared.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ShareViewPdfModule } from '../../../shared-view/share-view-pdf/share-view-pdf.module';
import { QuanLyCongViecRoutingModule } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/quan-ly-cong-viec-routing.module';
import { DragDropModule } from '@node_modules/@angular/cdk/drag-drop';
import { DanhSachCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/danh-sach-cong-viec.component';
import { CreateOrEditDuAnComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/create-or-update-du-an/create-or-edit-du-an.component';
import { CreateOrEditCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/create-or-update-cong-viec/create-or-edit-cong-viec.component';
import { TraoDoiCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/trao-doi-cong-viec/trao-doi-cong-viec.component';
import { ChiTietCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/create-or-update-cong-viec/chi-tiet-cong-viec/chi-tiet-cong-viec.component';
import { LichSuCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/lich-su-cong-viec/lich-su-cong-viec.component';
import { CrudChiTietCongViecComponent } from './danh-sach-cong-viec/create-or-update-cong-viec/chi-tiet-cong-viec/crud-chi-tiet-cong-viec/crud-chi-tiet-cong-viec.component';
import { ViewCongViecComponent } from './component-shared/view-cong-viec/view-cong-viec.component';
import { AntDesignModule } from '@node_modules/@orendaco/of';
import { ChiTietDanhSachTableComponent } from './danh-sach-cong-viec/nhan-vien/chi-tiet-danh-sach-table/chi-tiet-danh-sach-table.component';
import { CongViecCaNhanComponent } from './cong-viec-ca-nhan/cong-viec-ca-nhan.component';
import { ChiTietCongViecCaNhanComponent } from './cong-viec-ca-nhan/chi-tiet-cong-viec-ca-nhan/chi-tiet-cong-viec-ca-nhan.component';
import { CongViecCaNhanBoardComponent } from './cong-viec-ca-nhan/cong-viec-ca-nhan-board/cong-viec-ca-nhan-board.component';
import { ViewCongViecCaNhanComponent } from './cong-viec-ca-nhan/view-cong-viec-ca-nhan/view-cong-viec-ca-nhan.component';
import { ChiTietCongViecNhanVienComponent } from './danh-sach-cong-viec/nhan-vien/chi-tiet-cong-viec-nhan-vien/chi-tiet-cong-viec-nhan-vien.component';
import { ChiTietCongViecTruongPhongLanhDaoComponent } from './danh-sach-cong-viec/truong-phong-va-lanh-dao/chi-tiet-cong-viec-truong-phong-lanh-dao/chi-tiet-cong-viec-truong-phong-lanh-dao.component';
import { CongViecNhanVienBoardComponent } from './danh-sach-cong-viec/nhan-vien/cong-viec-nhan-vien-board/cong-viec-nhan-vien-board.component';
import { CongViecTruongPhongLanhDaoBoardComponent } from './danh-sach-cong-viec/truong-phong-va-lanh-dao/cong-viec-truong-phong-lanh-dao-board/cong-viec-truong-phong-lanh-dao-board.component';
import { UploadTaiLieuCongViecComponent } from './component-shared/upload-tai-lieu-cong-viec/upload-tai-lieu-cong-viec.component';
import { UploadFileDinhKemModalComponent } from './danh-sach-cong-viec/create-or-update-cong-viec/chi-tiet-cong-viec/upload-file-modal/upload-file-dinh-kem-modal.component';
@NgModule({
  declarations: [
    DanhSachCongViecComponent,
    CreateOrEditDuAnComponent,
    CreateOrEditCongViecComponent,
    ChiTietCongViecComponent,
    LichSuCongViecComponent,
    TraoDoiCongViecComponent,
    CrudChiTietCongViecComponent,
    ViewCongViecComponent,
    ChiTietDanhSachTableComponent,
    CongViecCaNhanComponent,
    ChiTietCongViecCaNhanComponent,
    CongViecCaNhanBoardComponent,
    ViewCongViecCaNhanComponent,
    ChiTietCongViecNhanVienComponent,
    ChiTietCongViecTruongPhongLanhDaoComponent,
    CongViecNhanVienBoardComponent,
    CongViecTruongPhongLanhDaoBoardComponent,
    UploadTaiLieuCongViecComponent,
    UploadFileDinhKemModalComponent,
  ],
  imports: [
    CommonModule,
    QuanLyCongViecRoutingModule,
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
    ShareViewPdfModule,
    NzImageModule,
    DragDropModule,
    AntDesignModule,
  ],
  providers: [BaseServiceProxies, { provide: NzModalRef, useValue: {} }],
})
export class QuanLyCongViecModule {}
