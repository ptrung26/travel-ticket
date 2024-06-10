import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking.component';
const routes: Routes = [
    {
        path: 'danh-sach',
        component: BookingComponent,
        data: { permission: 'DanhMuc.NhaCungCap', },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BookingRoutingModule { }
