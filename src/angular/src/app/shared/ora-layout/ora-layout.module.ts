import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@node_modules/@angular/router';
import {FilterPipeModule} from '@node_modules/@delon/util';
import {TranslateModule} from '@node_modules/@ngx-translate/core';
import {NzLayoutModule} from '@node_modules/ng-zorro-antd/layout';
import {NzMenuModule} from '@node_modules/ng-zorro-antd/menu';

import {MenuTopPhanCapComponent} from './menu-top-phan-cap/menu-top-phan-cap.component';
import {OraLayoutVerticalComponent} from './ora-layout-vertical/ora-layout-vertical.component';
import {CheckActiveMenuPipe} from './ora-layout-vertical/ora-menu-top/check-active-menu.pipe';
import {OraMenuTopComponent} from './ora-layout-vertical/ora-menu-top/ora-menu-top.component';
import {LayoutMenuTopComponent} from './ora-layout-horizontal/layout-menu-top/layout-menu-top.component';
import {MenuTopDropdownComponent} from './ora-layout-horizontal/menu-top-dropdown/menu-top-dropdown.component';
import {OraLayoutHorizontalComponent} from '@shared/ora-layout/ora-layout-horizontal/ora-layout-horizontal.component';
import {FormsModule, ReactiveFormsModule} from '@node_modules/@angular/forms';
import {PerfectScrollbarModule} from '@node_modules/ngx-perfect-scrollbar';
import {AntDesignModule} from '../../../app-ord-base/shared/ant-design.module';

const comExport = [OraLayoutVerticalComponent, MenuTopPhanCapComponent, OraLayoutHorizontalComponent];

@NgModule({
  declarations: [...comExport, OraMenuTopComponent, CheckActiveMenuPipe, LayoutMenuTopComponent, MenuTopDropdownComponent],
  exports: [...comExport, OraMenuTopComponent, AntDesignModule],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    RouterModule,
    TranslateModule,
    FilterPipeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PerfectScrollbarModule,
    AntDesignModule
  ],
})
export class OraLayoutModule {
}
