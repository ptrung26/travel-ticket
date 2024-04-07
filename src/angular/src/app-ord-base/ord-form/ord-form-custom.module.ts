import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AntDesignModule} from '../shared/ant-design.module';
import {DynamicFormPageComponent} from './dynamic-form/dynamic-form-page.component';
import {NgModule} from '@angular/core';
import {OnlyNumberDirective} from './directives/only-number-directive';
import {OnlyNumberAndSpaceDirective} from './directives/only-number-and-space-directive';
import {OrdDatePickerComponent} from './form-controls/ord-date-picker.component';
import {TextMaskModule} from 'angular2-text-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {OrdPwdInputComponent} from './form-controls/ord-pwd-input.component';
import {InputWithSearchIconComponent} from './form-controls/input-with-search-icon.component';
import {ResetSearchButtonComponent} from './form-controls/reset-search-button.component';
import {TranslateModule} from '@ngx-translate/core';
import {SearchButtonComponent} from './form-controls/search-button.component';
import {OrdSfComponent} from './ord-sf/ord-sf.component';
import {OrdDatePickerMonthComponent} from './form-controls/ord-date-picker-month.component';
import {ShowFormControlPipe} from './pipes/show-form-control.pipe';
import {OfLabelComponent} from './components/of-label/of-label.component';
import {OfFormSwitchComponent} from './components/of-form-switch/of-form-switch.component';
import {ElementIdControlPipe} from './pipes/element-id-control.pipe';
import {OrdDatePickerYearComponent} from './form-controls/ord-date-picker-year.component';
import {OrdFooterFixedComponent} from './ord-footer-fixed/ord-footer-fixed.component';
import {OrdDatePickerNonDynamicComponent} from './form-controls/ord-date-picker-custom-non-dynamic.component';
import {OrdComboExtensionComponent} from './dynamic-form/ord-combo-extension.component';
import {OrdDatePickerMonthCustomComponent} from './form-controls/ord-date-picker-month-custom.component';
import {TextAreaControlComponent} from './form-controls/base/text-area-control.component';
import {TextControlComponent} from './form-controls/base/text-control.component';
import {OnlyNumberControlComponent} from './form-controls/base/only-number-control.component';
import {SelectControlComponent} from './form-controls/base/select-control.component';
import {CheckBoxControlComponent} from './form-controls/base/check-box-control.component';
import {SwitchControlComponent} from './form-controls/base/switch-control.component';
import {RadioControlComponent} from './form-controls/base/radio-control.component';
import {DatePickerControlComponent} from './form-controls/base/date-picker-control.component';
import {CurrencyControlComponent} from './form-controls/base/currency-control.component';
import {NumberControlComponent} from './form-controls/base/number-control.component';
import {PassWordControlComponent} from './form-controls/base/pass-word-control.component';
import {HourTextControlComponent} from './form-controls/base/hour-text-control.component';
import {FileControlComponent} from './form-controls/base/file-control.component';
import {ValidateDynamicFormComponent} from './dynamic-form/validate-dynamic-form.component';
import {DateMonthPickerControlComponent} from './form-controls/base/date-month-picker-control.component';
import {OrdDataPickerRangeComponent} from './form-controls/base/ord-date-picker-range.component';
import {FormBuilderModule} from '@app/routes/form-builder/form-builder.module';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzUploadModule} from '@node_modules/ng-zorro-antd/upload';

const BaseControl = [
  TextAreaControlComponent,
  TextControlComponent,
  OnlyNumberControlComponent,
  SelectControlComponent,
  CheckBoxControlComponent,
  SwitchControlComponent,
  RadioControlComponent,
  DatePickerControlComponent,
  CurrencyControlComponent,
  NumberControlComponent,
  PassWordControlComponent,
  HourTextControlComponent,
  FileControlComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AntDesignModule,
    TextMaskModule,
    CurrencyMaskModule,
    FormBuilderModule,
    TranslateModule,
    NzSwitchModule,
    NzUploadModule
  ],
  declarations: [
    DynamicFormPageComponent,
    OnlyNumberDirective,
    OnlyNumberAndSpaceDirective,
    OrdDatePickerComponent,
    OrdPwdInputComponent,
    InputWithSearchIconComponent,
    SearchButtonComponent,
    ResetSearchButtonComponent,
    BaseControl,
    ValidateDynamicFormComponent,
    OrdSfComponent,
    OrdDatePickerMonthComponent,
    DateMonthPickerControlComponent,
    OrdDataPickerRangeComponent,
    ShowFormControlPipe,
    OfLabelComponent,
    OfFormSwitchComponent,
    ElementIdControlPipe,
    OrdDatePickerYearComponent,
    OrdFooterFixedComponent,
    OrdDatePickerNonDynamicComponent,
    OrdComboExtensionComponent,
    //AutoUpperCaseFirstCharDirective,
    OrdDatePickerMonthCustomComponent,
  ],
  exports: [
    DynamicFormPageComponent,
    OrdDatePickerComponent,
    DatePickerControlComponent,
    OrdDataPickerRangeComponent,
    OrdSfComponent,
    OrdDatePickerYearComponent,
    OrdPwdInputComponent,
    OrdFooterFixedComponent,
    OrdDatePickerNonDynamicComponent,
    OrdComboExtensionComponent,
    OrdDatePickerMonthCustomComponent,
    BaseControl,
  ]
})
export class OrdFormCustomModule {
}
