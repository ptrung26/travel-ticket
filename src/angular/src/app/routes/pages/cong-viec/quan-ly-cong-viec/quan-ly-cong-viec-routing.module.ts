import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/danh-sach-cong-viec.component';
import { CongViecCaNhanComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/cong-viec-ca-nhan/cong-viec-ca-nhan.component';

const routes: Routes = [
  {
    path: 'danh-sach',
    component: DanhSachCongViecComponent,
    data: { permission: 'CongViec.QuanLyCongViec' },
  },
  {
    path: 'ca-nhan',
    component: CongViecCaNhanComponent,
    data: { permission: 'CongViec.QuanLyCongViec.TruongPhong' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyCongViecRoutingModule {
}
