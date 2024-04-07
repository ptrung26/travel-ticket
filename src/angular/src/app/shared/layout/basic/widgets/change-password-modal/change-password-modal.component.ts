import {Component, Injector, OnInit} from '@angular/core';
import {
  DoiMatKhauRequest,
  TaiKhoanBaseCustomServiceProxy,
  UserSessionDto
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import {FormBuilder, FormControl, FormGroup, Validators} from '@node_modules/@angular/forms';
import {ModalComponentBase} from '@shared/common/modal-component-base';

@Component({
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent extends ModalComponentBase implements OnInit {
  rfDataModal: FormGroup;

  constructor(private injector: Injector, private fb: FormBuilder, private taiKhoanService: TaiKhoanBaseCustomServiceProxy) {
    super(injector);
    this.rfDataModal = this.fb.group({
      currentPassword: [undefined, [Validators.required]],
      password: [undefined, [Validators.required]],
      newPassword: [undefined, [Validators.required, this.confirmationValidator]],
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.rfDataModal.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  ngOnInit(): void {}

  save() {
    if (this.rfDataModal.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      const fValue = this.rfDataModal.value;
      const input = new DoiMatKhauRequest();
      let userSession = JSON.parse(sessionStorage.getItem('userSession')) as UserSessionDto;
      input.userId = userSession?.userId;
      input.sysUserId = userSession?.sysUserId;
      input.newPassword = fValue.password;
      input.currentPassword = fValue.currentPassword;
      this.taiKhoanService.doiMatKhau(input).subscribe((response) => {
        if (response.isSuccessful) {
          ora.notify.success('Đổi mật khẩu thành công!');
          this.success(true);
        } else {
          ora.notify.error(response.errorMessage);
        }
      });
    }
  }
}
