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
import { SoSaoKhachSanComboDirective } from './ora-select/directive/so-sao-khach-san-combo.directive';
import { ChoNgoiXeComboDirective } from './ora-select/directive/get-so-cho-combo.directive';
import { LoaiXeComboDirective } from './ora-select/directive/get-loai-xe-combo.directive';
import { LoaiTietTeComboDirective } from './ora-select/directive/get-loai-tien-te-combo.directive';
import { LoaiHopDongComboDirective } from './ora-select/directive/get-loai-hop-dong-combo.directive';
import { LoaiTourComboDirective } from './ora-select/directive/get-loai-tour-combo.directive';
import { LoaiHinhThaiDuLichComboDirective } from './ora-select/directive/get-loai-hinh-thai-du-lich-combo.directive';
import { TeleportDirective } from './ora-select/directive/teleport.directive';
import { CurrencyVNDPipe } from './ora-select/directive/currencyVND.directive';
import { CurrencyInputDirective } from './ora-select/directive/currency-input.directive';
import { LoaiKhachComboDirective } from './ora-select/directive/get-loai-khach-combo.directive';
import { TinhComboDirective } from './ora-select/directive/tinh.directive';
import { QuocGiaComboDirective } from './ora-select/directive/quoc-gia.directive';
import { QuocTichComboDirective } from './ora-select/directive/quoc-tich.diretive';
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
  SoSaoKhachSanComboDirective,
  ChoNgoiXeComboDirective,
  LoaiXeComboDirective,
  LoaiTietTeComboDirective,
  LoaiHopDongComboDirective,
  LoaiTourComboDirective,
  LoaiHinhThaiDuLichComboDirective,
  TeleportDirective,
  CurrencyVNDPipe,
  CurrencyInputDirective,
  LoaiKhachComboDirective,
  TinhComboDirective,
  QuocGiaComboDirective,
  QuocTichComboDirective

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
export class DataCommonModule { }
