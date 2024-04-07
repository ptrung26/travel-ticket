import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {TokenStorageService} from '@app/routes/auth/services/token.service';
import {UserExtensionServiceProxy} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'header-clear-storage',
  template: `
    <i nz-icon nzType="tool"></i>
    Xóa bộ nhớ đệm
  `,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.d-block]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderClearStorageComponent {
  constructor(
    private modalSrv: NzModalService,
    private messageSrv: NzMessageService,
    private _userExtensionServiceProxy: UserExtensionServiceProxy,
    private tokenService: TokenStorageService,
  ) {}

  @HostListener('click')
  _click(): void {
    this.modalSrv.confirm({
      nzTitle: 'Bạn có muốn xóa bộ nhớ tạm thời?',
      nzOnOk: () => {
        let authtoken = this.tokenService.getToken();
        let refreshtoken = this.tokenService.getRefreshToken();
        //this.ClearUserSessionCache();
        sessionStorage.clear();
        localStorage.clear();
        this.messageSrv.success('Xóa bộ nhớ tạm thời thành công!');
        this.tokenService.saveToken(authtoken);
        this.tokenService.saveRefreshToken(refreshtoken);
        window.location.reload();
      },
    });
  }

  // ClearUserSessionCache() {
  //   ora.ui.setBusy();
  //   this._userExtensionServiceProxy
  //     .clearUserSessionCache()
  //     .pipe(finalize(ora.ui.clearBusy))
  //     .subscribe((res) => {
  //     });
  // }
}
