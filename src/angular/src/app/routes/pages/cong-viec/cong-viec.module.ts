import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { OraTableModule } from '@app/shared/customize-comp/ora-table/ora-table.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { NzListModule } from '@node_modules/ng-zorro-antd/list';
import { NzTagModule } from '@node_modules/ng-zorro-antd/tag';
import { SharedModule } from '@shared/shared.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CongViecRoutingModule } from '@app/routes/pages/cong-viec/cong-viec-routing.module';
import { DashboardCongViecComponent } from '@app/routes/pages/cong-viec/dashboard/dashboard-cong-viec.component';
import { LichCongViecComponent } from './lich-cong-viec/lich-cong-viec.component';
import { FullCalendarModule } from '@node_modules/@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,
    CongViecRoutingModule,
    NzTagModule,
    SharedModule,
    NzListModule,
    OraTableModule,
    ReactiveFormsModule,
    CustomizeCompModule,
    NzDividerModule,
    DataCommonModule,
    FormsModule,
    NzModalModule,
    FullCalendarModule,
  ],
  declarations: [DashboardCongViecComponent, LichCongViecComponent],
})
export class CongViecModule {}
