import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TinhComponent } from './tinh/tinh.component';
import { HuyenComponent } from './huyen/huyen.component';
import { XaComponent } from './xa/xa.component';
import { QuocTichComponent } from './quoc-tich/quoc-tich.component';
import { NhaCungCapComponent } from './nha-cung-cap/nha-cung-cap.component';
import { CauHinhChungComponent } from './cau-hinh-chung/cau-hinh-chung.component';
import { DanhMucComponent } from './danh-muc-chung/danh-muc.component';

const routes: Routes = [
  {
    path: 'danh-muc-chung',
    component: DanhMucComponent,
    data: { permission: 'DanhMuc.CodeSystem' },
  },
  {
    path: 'cau-hinh-chung',
    component: CauHinhChungComponent,
    data: { permission: 'DanhMuc.SystemConfig' },
  },
  {
    path: 'tinh',
    component: TinhComponent,
    data: { permission: 'DanhMuc.Tinh' },
  },
  {
    path: 'huyen',
    component: HuyenComponent,
    data: { permission: 'DanhMuc.Huyen' },
  },
  {
    path: 'xa',
    component: XaComponent,
    data: { permission: 'DanhMuc.Xa' },
  },
  {
    path: 'quoc-tich',
    component: QuocTichComponent,
    data: { permission: 'DanhMuc.QuocGia' },
  },
  {
    path: 'nha-cung-cap',
    component: NhaCungCapComponent,
    data: { permission: 'DanhMuc.NhaCungCap' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhMucRoutingModule {}
