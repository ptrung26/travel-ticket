import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@node_modules/@angular/cdk/drag-drop';
import { NzOutletModule } from '@node_modules/ng-zorro-antd/core/outlet';
import { OraDropListComponent } from './ora-drop-list/ora-drop-list.component';

@NgModule({
  declarations: [OraDropListComponent],
  imports: [CommonModule, DragDropModule, NzOutletModule],
  exports: [OraDropListComponent],
})
export class OraDragDropListModule {}
