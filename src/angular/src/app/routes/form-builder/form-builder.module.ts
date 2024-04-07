import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonEnumComboComponent} from './_subs/combo-box/common-enum-combo/common-enum-combo.component';
import {DataFromDbComboComponent} from './_subs/combo-box/data-from-db-combo/data-from-db-combo.component';
import {TreeViewSelectComponent} from './_subs/combo-box/tree-view-select/tree-view-select.component';
import {TextMaskModule} from '@node_modules/angular2-text-mask';
import {SoKyTuSoThePipe} from './_subs/pipes/so-ky-tu-so-the.pipe';
import {IsSuccessSoThePipe} from './_subs/pipes/is-success-so-the.pipe';
import {AppSwitchFormControlAcComponent} from './_subs/auto-complete/app-switch-form-control-ac.component';
import {FormBuilderComponent} from './form-builder.component';
import {OnlyNumberAndSpaceDirective} from './directives/only-number-and-space-directive';
import {OnlyNumberDirective} from './directives/only-number-directive';
import {NumberDirective} from './directives/number.directive';
import {AntDesignModule} from 'src/app-ord-base/shared/ant-design.module';
import {NzTreeSelectModule} from '@node_modules/ng-zorro-antd/tree-select';

const ACForm = [AppSwitchFormControlAcComponent];

@NgModule({
  declarations: [
    FormBuilderComponent,
    OnlyNumberAndSpaceDirective,
    OnlyNumberDirective,
    CommonEnumComboComponent,
    DataFromDbComboComponent,
    TreeViewSelectComponent,
    ...ACForm,
    NumberDirective,
    SoKyTuSoThePipe,
    IsSuccessSoThePipe,

  ],
  exports: [FormBuilderComponent, OnlyNumberDirective, CommonEnumComboComponent, DataFromDbComboComponent, ...ACForm],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AntDesignModule, TextMaskModule,
    NzTreeSelectModule],
})
export class FormBuilderModule {
}
