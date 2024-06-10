import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentModule } from '@app/shared/directives/shared-component.module';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import { NzLayoutModule } from '@node_modules/ng-zorro-antd/layout';
import { NzSwitchModule } from '@node_modules/ng-zorro-antd/switch';
import { NzUploadModule } from '@node_modules/ng-zorro-antd/upload';
import { CustomizeCompModule } from '@shared/customize-comp/customize-comp.module';
import { OraTableModule } from '@shared/customize-comp/ora-table/ora-table.module';
import { DataCommonModule } from '@shared/data-common/data-common.module';
import { SharedModule } from '@shared/shared.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { KhachHangRoutingModule } from './khach-hang-routing.module';
import { KhachHangComponent } from './khach-hang.component';
import { CrudKhachHangComponent } from './crud-khach-hang/crud-khach-hang.component';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        OraTableModule,
        ReactiveFormsModule,
        CustomizeCompModule,
        NzListModule,
        NzDividerModule,
        DataCommonModule,
        FormsModule,
        NzLayoutModule,
        NzSwitchModule,
        NzUploadModule,
        SharedComponentModule,
        KhachHangRoutingModule
    ],
    declarations: [
        KhachHangComponent,
        CrudKhachHangComponent
    ],
})
export class KhachHangModule { }
