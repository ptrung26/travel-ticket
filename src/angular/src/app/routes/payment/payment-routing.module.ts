import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaymentProcess } from './payment-process/payment-process.component';

const routes: Routes = [
    {
        path: 'new',
        component: PaymentComponent,
    }, {
        path: 'process',
        component: PaymentProcess,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PaymentRoutingModule {
}
