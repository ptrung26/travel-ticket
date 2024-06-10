import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourSanPhamComponent } from './tour-san-pham/tour-san-pham.component';
const routes: Routes = [
    {
        path: 'tour-san-pham',
        component: TourSanPhamComponent,
        data: { permission: 'DanhMuc.NhaCungCap', },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SanPhamRoutingModule { }
