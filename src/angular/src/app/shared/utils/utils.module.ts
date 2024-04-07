import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';
//import { FileDownloadService } from './file-download.service';
import { ScriptLoaderService } from './script-loader.service';
import { EqualValidator } from './validation/equal-validator.directive';
import { PasswordComplexityValidator } from './validation/password-complexity-validator.directive';
import { LuxonFromNowPipe } from './luxon-from-now.pipe';
import { LuxonFormatPipe } from './luxon-format.pipe';
//import { LocalizePipe } from './localize.pipe';
//import { LocalStorageService } from './local-storage.service';
import { ClickOutsideDirective } from './click-outside.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [CommonModule],
  providers: [
    ScriptLoaderService,
    //LocalStorageService
  ],
  declarations: [
    EqualValidator,
    PasswordComplexityValidator,
    AutoFocusDirective,
    LuxonFromNowPipe,
    LuxonFormatPipe,
    //LocalizePipe,
    ClickOutsideDirective,
  ],
  exports: [
    EqualValidator,
    PasswordComplexityValidator,
    AutoFocusDirective,
    LuxonFromNowPipe,
    LuxonFormatPipe,
    //LocalizePipe,
    ClickOutsideDirective,
    DragDropModule,
  ],
})
export class UtilsModule {}
