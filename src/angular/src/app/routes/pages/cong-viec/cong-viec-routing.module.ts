import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCongViecComponent } from '@app/routes/pages/cong-viec/dashboard/dashboard-cong-viec.component';
import { LichCongViecComponent } from '@app/routes/pages/cong-viec/lich-cong-viec/lich-cong-viec.component';

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: DashboardCongViecComponent,
  //   data: { permission: 'CongViecPermission' },
  // },
  {
    path: 'quan-ly-cong-viec',
    loadChildren: () => import('./quan-ly-cong-viec/quan-ly-cong-viec.module').then((m) => m.QuanLyCongViecModule), // Lazy load main module
    data: { preload: true },
  },
  {
    path: 'tong-quan',
    component: DashboardCongViecComponent,
    data: { preload: true },
  },
  {
    path: 'lich-cong-viec',
    component: LichCongViecComponent,
    data: { permission: 'CongViec.LichCongViec' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CongViecRoutingModule {}
