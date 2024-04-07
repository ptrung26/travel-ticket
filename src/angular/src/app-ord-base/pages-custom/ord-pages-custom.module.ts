import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AntDesignModule } from '../shared/ant-design.module';
import { SearchBoxPageComponent } from './ord-search-box/search-box-page.component';
import { OrdFormCustomModule } from '../ord-form/ord-form-custom.module';
import { OrdCreateOrUpdateModalComponent } from './ord-create-or-update-modal/ord-create-or-update-modal.component';
import { OrdUpsertPageComponent } from './ord-upsert-page/ord-upsert-page.component';
import { OrdUpsertDrawerComponent } from './ord-upsert-drawer/ord-upsert-drawer.component';
import { OrdUpsertModalComponent } from './ord-upsert-modal/ord-upsert-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzSelectModule,
    AntDesignModule,
    OrdFormCustomModule
  ],
  declarations: [
    SearchBoxPageComponent,
    OrdCreateOrUpdateModalComponent,
    OrdUpsertPageComponent,
    OrdUpsertDrawerComponent,
    OrdUpsertModalComponent
  ],
  exports: [
    SearchBoxPageComponent,
    OrdCreateOrUpdateModalComponent,
    OrdUpsertPageComponent,
    OrdUpsertDrawerComponent,
    OrdUpsertModalComponent
  ]
})
export class OrdPagesCustomModule {
}
