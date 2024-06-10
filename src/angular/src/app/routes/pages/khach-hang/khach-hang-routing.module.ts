import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KhachHangComponent } from './khach-hang.component';
const routes: Routes = [
    {
        path: 'danh-sach',
        component: KhachHangComponent,
        data: { permission: 'DanhMuc.NhaCungCap', },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KhachHangRoutingModule { }
