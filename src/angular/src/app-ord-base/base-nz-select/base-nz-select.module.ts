import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BaseNzSelectComponent } from './base-nz-select.component';

@NgModule({
  declarations: [
    BaseNzSelectComponent
  ],
  imports: [
    CommonModule,
    NzSelectModule,
    FormsModule,
  ],
  exports: [BaseNzSelectComponent]
})
export class BaseNzSelectModule { }
