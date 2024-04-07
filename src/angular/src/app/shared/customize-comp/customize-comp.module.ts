import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import { TextMaskModule } from '@node_modules/angular2-text-mask';
import { NzButtonModule } from '@node_modules/ng-zorro-antd/button';
import { NzOutletModule } from '@node_modules/ng-zorro-antd/core/outlet';
import { NzDatePickerModule } from '@node_modules/ng-zorro-antd/date-picker';
import { NzDropDownModule } from '@node_modules/ng-zorro-antd/dropdown';
import { NzGridModule } from '@node_modules/ng-zorro-antd/grid';
import { NzIconModule } from '@node_modules/ng-zorro-antd/icon';
import { OraPageHeaderComponent } from '@shared/customize-comp/ora-page-header/ora-page-header.component';
import { OrdOverlayContentComponent } from '@shared/customize-comp/ord-overlay-tringer/ord-overlay-content/ord-menu.component';
import { OrdOverlayTringgerDirective } from '@shared/customize-comp/ord-overlay-tringer/ord-overlay-tringger.directive';
import { DropDownUploadExcelComponent } from './drop-down-upload-excel/drop-down-upload-excel.component';
import { OraLayoutFilterComponent } from './ora-layout-filter/ora-layout-filter.component';
import { AbsPipe } from './pipe/abs.pipe';
import { OraNumberV2 } from './pipe/ora-number-v2.pipe';
import { OraNumberStrPipe } from './pipe/ora-numberStr.Pipe';
import { StringToObjPipe } from './pipe/string-to-obj.pipe';
import { UppercaseFirstLetterPipe } from './pipe/uppercase-first-letter.pipe';
import { UppercaseFirstWordPipe } from './pipe/uppercase-first-word.pipe';
import { ProgressBarType2Component } from './progress-bar-type2/progress-bar-type2.component';

import { FileManagerSyncfusionComponent } from '@shared/customize-comp/filemanager-syncfusion/filemanager-syncfusion.component';
import { HotroFilemanagerSyncfusionComponent } from '@shared/customize-comp/filemanager-syncfusion/hotro-filemanager-syncfusion.component';
import { RichTextEditorSyncfusionComponent } from '@shared/customize-comp/richtexteditor-syncfusion/richtexteditor-syncfusion.component';
import { FileManagerAllModule } from '@syncfusion/ej2-angular-filemanager';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SHARED_ZORRO_MODULES } from '../shared-zorro.module';
import { UtilsModule } from '../utils/utils.module';
import { ImgTempModalComponent } from './img-temp-modal/img-temp-modal.component';
import { ImgTempSelectComponent } from './img-temp-select/img-temp-select.component';
import { OraCKEditorComponent } from './ora-ckeditor/ora-ckeditor.component';
import { OraDataPickerCustomComponent } from './ora-data-picker/ora-data-picker-custom.component';
import { OraDatePickerTimerComponent } from './ora-data-picker/ora-data-picker-timer.component';
import { OraDataPickerComponent } from './ora-data-picker/ora-data-picker.component';
import { CallbackPipe } from './pipe/call-back.pipe';
import { ConvertDdFrom100gTpPipe } from './pipe/convert-dd-from100g-tp.pipe';
import { OraSearchFilterListPipe } from './pipe/ora-search-filter-list.component';
import { SafePipe } from './pipe/SafePipe';
import { ShowImagePipe } from './pipe/show-img.pipe copy';
import { LikeButtonComponent } from './like-button/like-button.component';
import { ViewPdfSharedComponent } from '@shared/customize-comp/view-pdf/view-pdf.component';
import { ViewVideoComponent } from './view-video/view-video.component';

//import { DialogModule } from '@syncfusion/ej2-angular-popups';
const comCustomize = [
  OraPageHeaderComponent,
  OraLayoutFilterComponent,
  OraCKEditorComponent,
  DropDownUploadExcelComponent,
  ProgressBarType2Component,
  ImgTempSelectComponent,
  ImgTempModalComponent,
  OrdOverlayContentComponent,
  OrdOverlayTringgerDirective,
  OraDataPickerComponent,
  OraDataPickerCustomComponent,
  FileManagerSyncfusionComponent,
  RichTextEditorSyncfusionComponent,
  HotroFilemanagerSyncfusionComponent,
  OraDatePickerTimerComponent,
  LikeButtonComponent,
  ViewPdfSharedComponent,
  ViewVideoComponent,
];
const PIPE = [
  CallbackPipe,
  ConvertDdFrom100gTpPipe,
  OraNumberStrPipe,
  OraNumberV2,
  UppercaseFirstWordPipe,
  UppercaseFirstLetterPipe,
  StringToObjPipe,
  AbsPipe,
  SafePipe,
  ShowImagePipe,
  OraSearchFilterListPipe,
];

@NgModule({
  declarations: [...comCustomize, ...PIPE, LikeButtonComponent],
  exports: [...comCustomize, ...PIPE],
  imports: [
    CommonModule,
    NzOutletModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    ...SHARED_ZORRO_MODULES,
    // AngularEditorModule,
    // TextMaskModule,
    ImageCropperModule,
    UtilsModule,
    // CountoModule,
    // ColorPickerModule,
    NzDatePickerModule,
    TextMaskModule,
    FileManagerAllModule,
    RichTextEditorModule,
  ],
})
export class CustomizeCompModule {}
