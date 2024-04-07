import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPipesModule } from '@node_modules/ng-zorro-antd/pipes';
import { AppOrdBaseModule } from 'src/app-ord-base/app-ord-base.module';
import { AntDesignModule } from 'src/app-ord-base/shared/ant-design.module';

@NgModule({
  declarations: [],
  exports: [],
  imports: [CommonModule, FormsModule, AntDesignModule, ReactiveFormsModule, AppOrdBaseModule, NzPipesModule],
})
export class AppViewSharedModule {}
