import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomizeCompModule } from '../../../shared/customize-comp/customize-comp.module';
import { ShareViewPdfRoutingModule } from './share-view-pdf-routing.module';
import { ShareViewPdfComponent } from './share-view-pdf/share-view-pdf.component';

@NgModule({
  declarations: [ShareViewPdfComponent],
  imports: [CommonModule, CustomizeCompModule, ShareViewPdfRoutingModule],
  exports: [ShareViewPdfComponent],
})
export class ShareViewPdfModule {}
