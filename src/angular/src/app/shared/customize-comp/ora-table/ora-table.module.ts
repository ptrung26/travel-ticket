import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@node_modules/@ngx-translate/core';
import { NzOutletModule } from '@node_modules/ng-zorro-antd/core/outlet';
import { NzPaginationModule } from '@node_modules/ng-zorro-antd/pagination';
import { NzTableModule } from '@node_modules/ng-zorro-antd/table';
import { OraColumnDirective } from '@shared/customize-comp/ora-table/directives/ora-column.directive';
import { OraHeaderDirective } from '@shared/customize-comp/ora-table/directives/ora-header.directive';
import { OraTableComponent } from '@shared/customize-comp/ora-table/table.component';
import { OraCellDirective } from './directives/ora-cell.directive';

const COM_EXPORT = [OraTableComponent, OraColumnDirective, OraCellDirective, OraHeaderDirective];

@NgModule({
  declarations: [...COM_EXPORT],
  exports: [...COM_EXPORT],
  imports: [CommonModule, NzTableModule, NzOutletModule, TranslateModule, NzPaginationModule],
})
export class OraTableModule {}
