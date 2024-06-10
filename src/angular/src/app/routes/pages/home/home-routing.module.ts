import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ChiTietSanPhamComponent } from './chi-tiet-sp/chi-tiet-sp.component';
import { MyBookingCompoennt } from './my-booking/my-booking.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { FilterTourDuLichComponent } from './filter-tour-du-lich/filter-tour-du-lich.component';
const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    }, {
        path: 'tour-du-lich/:id',
        component: ChiTietSanPhamComponent
    }, {
        path: 'my-booking',
        component: MyBookingCompoennt,
    }, {
        path: 'about-me',
        component: AboutMeComponent,
    }, {
        path: 'filter-tour',
        component: FilterTourDuLichComponent,

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule { }
