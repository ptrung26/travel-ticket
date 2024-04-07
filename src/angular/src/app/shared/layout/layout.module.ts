import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { LayoutDefaultModule } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnModule } from '@delon/theme/theme-btn';
import { TranslateModule } from '@node_modules/@ngx-translate/core';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { OraLayoutModule } from './../ora-layout/ora-layout.module';
import { LayoutBasicComponent } from './basic/basic.component';
import { AccountAvatarComponent } from './basic/widgets/account-avatar/account-avatar.component';
import { ChangePasswordModalComponent } from './basic/widgets/change-password-modal/change-password-modal.component';
import { HeaderClearStorageComponent } from './basic/widgets/clear-storage.component';
import { DateAgoPipeBasic } from './basic/widgets/date-ago-basic.pipe';
import { HeaderFullScreenComponent } from './basic/widgets/fullscreen.component';
import { HeaderSearchComponent } from './basic/widgets/search.component';
import { UpdateProfileModalComponent } from './basic/widgets/update-profile-modal/update-profile-modal.component';
import { HeaderUserComponent } from './basic/widgets/user.component';
import { LayoutBlankComponent } from './blank/blank.component';
import { AppNavigationService } from './nav/app-navigation.service';
import { NzDropDownModule } from '@node_modules/ng-zorro-antd/dropdown';
import { NzSpinModule } from '@node_modules/ng-zorro-antd/spin';
import { NzFormModule } from '@node_modules/ng-zorro-antd/form';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

const COMPONENTS = [
  LayoutBasicComponent,
  LayoutBlankComponent,
  ChangePasswordModalComponent,
  UpdateProfileModalComponent,
  AccountAvatarComponent,
];
const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderFullScreenComponent,
  HeaderClearStorageComponent,
  HeaderUserComponent,
  DateAgoPipeBasic,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ThemeBtnModule,
    SettingDrawerModule,
    LayoutDefaultModule,
    NoticeIconModule,
    ReuseTabModule,
    TranslateModule,
    ReactiveFormsModule,
    NzUploadModule,
    OraLayoutModule,
    NzDropDownModule,
    NzSpinModule,
    NzFormModule,
    NzTimelineModule,
  ],

  declarations: [...COMPONENTS, ...HEADERCOMPONENTS],
  exports: [...COMPONENTS],
  providers: [AppNavigationService],
})
export class LayoutModule {}
