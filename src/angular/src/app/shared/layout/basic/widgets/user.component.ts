import { ConfigStateService, SubscriptionService } from '@abp/ng.core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TokenStorageService } from '@app/routes/auth/services/token.service';
import { AppConsts } from '@app/shared/AppConsts';
import { UserExtensionServiceProxy, UserSessionDto } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { AppSessionState } from '@app/stores/app-session/state';
import { Select } from '@ngxs/store';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import { ChangePasswordModalComponent } from '@shared/layout/basic/widgets/change-password-modal/change-password-modal.component';
import { UpdateProfileModalComponent } from '@shared/layout/basic/widgets/update-profile-modal/update-profile-modal.component';
import { Observable } from 'rxjs';
import { AccountAvatarComponent } from './account-avatar/account-avatar.component';
import { LEVEL } from '@app/shared/service-proxies/danh-muc-service-proxies';

@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      <ng-container *ngIf="userSession$ | async as user">
        <img id="avatar" style="width: 40px; border-radius: 50%" src="{{ srcUrl }}" (error)="imageError()" class="mr-sm" />
        <span style="font-size: 16px; line-height: 24px; font-weight: 500; color: #255586">{{ user.username }}</span>
      </ng-container>
      <!-- nzSrc="assets/common/no-avatar.png" -->
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm" style="width: fit-content !important">
        <div nz-menu-item *ngIf="hasReturnAdmin" (click)="tokenService.returnAdmin()()">
          <i nz-icon nzType="rollback" nzTheme="outline"></i>
          Quay lại tài khoản của tôi
        </div>
        <div nz-menu-item (click)="showChangePasswordModal()">
          <i nz-icon nzType="key" class="mr-sm"></i>
          Đổi mật khẩu
        </div>
        <div nz-menu-item (click)="showProfileModal()">
          <i nz-icon nzType="user" class="mr-sm"></i>
          Thông tin tài khoản
        </div>
        <!-- <div nz-menu-item routerLink="/pro/account/settings">
                <i nz-icon nzType="setting" class="mr-sm"></i>
                Cấu hình
              </div> -->
        <div nz-menu-item (click)="changeAvatar()">
          <i nz-icon nzType="camera" class="mr-sm"></i>
          Thay đổi hình ảnh đại diện
        </div>
        <div nz-menu-item (click)="updateSoThutuchungChi()" *ngIf="sessionUser.hocVienId > 0">
          <i nz-icon nzType="edit" class="mr-sm"></i>
          Cập nhật số cấp chứng chỉ/Giấy chứng nhận
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          Đăng xuất
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  providers: [SubscriptionService],
})
export class HeaderUserComponent implements OnInit {
  @Select(AppSessionState.userSession) userSession$: Observable<UserSessionDto>;
  srcUrl;
  userId = '';
  sessionUser: any = {};
  avatarComp: AccountAvatarComponent;
  hasReturnAdmin = false;

  constructor(
    private config: ConfigStateService,
    private nzModal: NzModalService,
    public cdr: ChangeDetectorRef,
    private taiKhoanService: UserExtensionServiceProxy,
    public readonly tokenService: TokenStorageService,
    private userExtensionService: UserExtensionServiceProxy,
  ) {}

  ngOnInit(): void {
    this.userId = this.config.getAll().currentUser.id;
    this.hasReturnAdmin = this.tokenService.hasReturnAdmin();
    this.srcUrl = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${this.userId}`;
    this.userExtensionService.userSession().subscribe((res: UserSessionDto) => {
      if (res?.dateBlackList === undefined) {
        res.dateBlackList = null;
      }
      this.sessionUser = res;
      sessionStorage.setItem('userSession', JSON.stringify(res));
    });
  }

  logout(): void {
    this.taiKhoanService.clearUserSessionCache().subscribe(() => {
      localStorage.clear();
      sessionStorage.clear();
      location.href = '/account/login';
    });
  }

  showChangePasswordModal() {
    this.nzModal
      .create({
        nzContent: ChangePasswordModalComponent,
        nzFooter: null,
        nzTitle: 'Thay đổi mật khẩu',
      })
      .afterClose.subscribe((result) => {
        if (result) {
          ora.notify.info('Xử lý thành công');
        }
      });
  }

  changeAvatar() {
    this.nzModal
      .create({
        nzContent: AccountAvatarComponent,
        nzFooter: null,
        nzTitle: 'Thay đổi ảnh đại diện',
      })
      .afterClose.subscribe((result) => {});
  }

  showProfileModal() {
    this.nzModal
      .create({
        nzContent: UpdateProfileModalComponent,
        nzFooter: null,
        nzTitle: 'Cập nhật thông tin tài khoản',
      })
      .afterClose.subscribe((result) => {
        if (result) {
          ora.notify.info('Xử lý thành công');
        }
      });
  }

  imageError() {
    this.srcUrl = './assets/no-avatar.png';
  }
}
