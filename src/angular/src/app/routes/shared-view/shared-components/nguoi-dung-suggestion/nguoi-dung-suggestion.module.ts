import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguoiDungSuggestionComponent } from './nguoi-dung-suggestion.component';
import { BaseNzSelectModule } from '../../../../../app-ord-base/base-nz-select/base-nz-select.module';

@NgModule({
  declarations: [NguoiDungSuggestionComponent],
  imports: [
    CommonModule,
    BaseNzSelectModule
  ],
  exports: [
    NguoiDungSuggestionComponent
  ]
})
export class NguoiDungSuggestionModule { }
