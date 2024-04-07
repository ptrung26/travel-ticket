import { NgModule } from '@angular/core';
import { AntDesignModule } from './shared/ant-design.module';
import { OrdColumnComponent } from './ord-datatable/ord-column.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdFormCustomModule } from './ord-form/ord-form-custom.module';
import { OrdPagesCustomModule } from './pages-custom/ord-pages-custom.module';
import { CrudDataTableService } from './services/crud-data-table.service';
import { OrdGeneralModule } from './general/ord-general.module';
import { ReadFileExcelService } from './services/read-file-excel.service';
// import { NgxDatatableModule } from '@node_modules/@swimlane/ngx-datatable';
import { BtnListShowColumnsConfigComponent } from './ord-datatable/btn-list-show-columns-config/btn-list-show-columns-config.component';
import { OrdColumnTreeViewComponent } from './ord-datatable/ord-column-treeview.component';
import { DatatableTreeViewComponent } from './ord-datatable/ord-datatable-treeview.component';
import { OrdPaginationFetchDataComponent } from './ord-datatable/ord-pagination-fetch-data/ord-pagination-fetch-data.component';
import { ShowColumnPipe } from './ord-datatable/pipes/show-column.pipe';
import { OrdDataTableActionCellComponent } from './ord-datatable/cells/action-cell.component';
import { OrdPaginationComponent } from './ord-datatable/ord-pagination/ord-pagination.component';
import { VarDirective } from './directives/ng-var.directive';
import { DatatableComponent } from './ord-datatable/ord-datatable.component';
import { FormBuilderModule } from '@app/routes/form-builder/form-builder.module';
import { BaseTableEditComponent } from './base-table-edit/base-table-edit.component';
import { BaseFormComponent } from './base-form/base-form.component';


@NgModule({
  declarations: [
    OrdColumnComponent,
    DatatableComponent,
    OrdDataTableActionCellComponent,
    OrdPaginationComponent,
    BtnListShowColumnsConfigComponent,
    OrdColumnTreeViewComponent,
    DatatableTreeViewComponent,
    VarDirective,
    OrdPaginationFetchDataComponent,
    ShowColumnPipe,
    BaseTableEditComponent,
    BaseFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AntDesignModule,
    OrdFormCustomModule,
    OrdPagesCustomModule,
    OrdGeneralModule,
    // NgxDatatableModule,
    FormBuilderModule
  ],
  exports: [
    AntDesignModule,
    OrdColumnComponent,
    DatatableComponent,
    OrdFormCustomModule,
    OrdPagesCustomModule,
    OrdGeneralModule,
    OrdColumnTreeViewComponent,
    DatatableTreeViewComponent,
    VarDirective,
    OrdPaginationComponent,
    OrdPaginationFetchDataComponent
  ],
  providers: [
    CrudDataTableService,
    ReadFileExcelService
  ]
})
export class AppOrdBaseModule {
}
