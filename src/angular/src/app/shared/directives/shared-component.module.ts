import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CustomizeCompModule } from '../customize-comp/customize-comp.module';
import { OraTableModule } from '../customize-comp/ora-table/ora-table.module';
import { DataCommonModule } from '../data-common/data-common.module';
import { SharedModule } from '../shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzSwitchModule,
    SharedModule,
    NzListModule,
    OraTableModule,
    ReactiveFormsModule,
    CustomizeCompModule,
    NzDividerModule,
    DataCommonModule,
    FormsModule,
  ],
  exports: [],
})
export class SharedComponentModule {}
