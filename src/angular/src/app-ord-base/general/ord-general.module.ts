import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../shared/ant-design.module';
import { BtnAddItemComponent } from './button/btn-add-item.component';
import { BtnUploadFileComponent } from './button/btn-upload-file.component';
import { ImportDataExcelComponent } from './data-importing/import-data-excel/import-data-excel.component';
import { BtnBackPageComponent } from './button/btn-back-page.component';
import { RouterModule } from '@angular/router';
import { BtnImportExcelComponent } from './button/btn-import-excel.component';
import { BtnExportPagingListComponent } from './button/btn-export-paging-list.component';

@NgModule({
  declarations: [
    BtnAddItemComponent,
    BtnUploadFileComponent,
    ImportDataExcelComponent,
    BtnBackPageComponent,
    BtnImportExcelComponent,
    BtnExportPagingListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AntDesignModule,
    RouterModule
  ],
  exports: [
    BtnAddItemComponent,
    BtnUploadFileComponent,
    ImportDataExcelComponent,
    BtnBackPageComponent,
    BtnImportExcelComponent,
    BtnExportPagingListComponent
  ],
  providers: []
})
export class OrdGeneralModule {
}
