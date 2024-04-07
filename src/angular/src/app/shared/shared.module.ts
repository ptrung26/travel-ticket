import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppViewSharedModule} from '@app/routes/shared-view/shared-view.module';
import {TranslateModule} from '@node_modules/@ngx-translate/core';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AppOrdBaseModule} from 'src/app-ord-base/app-ord-base.module';
import {UtilsModule} from './utils/utils.module';
import {ValidationCustomComponent} from './utils/custom/validation-custom.component';
import {SharedDirectiveCommonModule} from '@shared/directives/shared-directive-common.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    UtilsModule,
  ],
  declarations: [
    ValidationCustomComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ValidationCustomComponent,
    AppOrdBaseModule,
    AppViewSharedModule,
    PerfectScrollbarModule,
    //NgClockPickerLibModule,
    UtilsModule,
    SharedDirectiveCommonModule,
    TranslateModule
  ],
})
export class SharedModule {
}
