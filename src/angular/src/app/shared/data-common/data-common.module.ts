import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import { NzRadioModule } from '@node_modules/ng-zorro-antd/radio';
import { NzSelectModule } from '@node_modules/ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { SHARED_ZORRO_MODULES } from '../shared-zorro.module';
import { BaseDynamicComboComponent } from './ora-select/component/base-dynamic-combo.component';
import { BaseDynamicValueNumberComboComponent } from './ora-select/component/base-dynamic-value-number-combo.component';
import { CommonDropDownComboComponent } from './ora-select/component/common-dropdown-combo.component';
import { EnumComboComponent } from './ora-select/component/common-enum-combo.component';
import { IsActiveComboComponent } from './ora-select/component/is-active-combo.component';
import { OraFileUploadControlComponent } from './ora-select/component/ora-file-upload-control.component';
import { OraRadioComponent } from './ora-select/ora-radio.component';
import { OraSelectComponent } from './ora-select/ora-select.component';
//import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { InputTimePickerComponent } from './ora-select/component/input-time-picker.component';
import { HuyenComboDirective } from './ora-select/directive/huyen.directive';
import { XaComboDirective } from './ora-select/directive/xa.directive';
import { CodeSystemComboDirective } from './ora-select/directive/code-system-combo.directive';
const com = [
  OraSelectComponent,
  OraRadioComponent,
  IsActiveComboComponent,
  BaseDynamicComboComponent,
  EnumComboComponent,
  BaseDynamicValueNumberComboComponent,
  OraFileUploadControlComponent,
  CommonDropDownComboComponent,
  InputTimePickerComponent,
  HuyenComboDirective,
  XaComboDirective,
  CodeSystemComboDirective,
];

@NgModule({
  declarations: [...com],
  exports: [...com],
  imports: [
    CommonModule,
    NzRadioModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzUploadModule,
    FormsModule,
    NzCascaderModule,
    NzTimePickerModule,
    NzTagModule,
    NzModalModule,
    //AmazingTimePickerModule,
    ...SHARED_ZORRO_MODULES,
  ],
})
export class DataCommonModule {}
