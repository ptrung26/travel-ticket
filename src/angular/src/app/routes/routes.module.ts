import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// single pages
import { RouteRoutingModule } from './routes-routing.module';
import { AuthGuardService } from '@app/routes/auth-guard.service';
import { NotHavePermissionComponent } from './not-have-permission/not-have-permission.component';
import { FormBuilderModule } from './form-builder/form-builder.module';
import { OraTableModule } from '@app/shared/customize-comp/ora-table/ora-table.module';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { DateAgoPipe } from './dashboard/date-ago.pipe';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { NotificationsComponent } from '@app/routes/notifications/notifications.component';

@NgModule({
  imports: [SharedModule, RouteRoutingModule, NzDatePickerModule, FormBuilderModule, OraTableModule, CustomizeCompModule, DataCommonModule],
  declarations: [
    NotHavePermissionComponent,
    DashboardComponent,
    NotificationsComponent,
    DateAgoPipe],
  providers: [AuthGuardService],
})
export class RoutesModule {
}
