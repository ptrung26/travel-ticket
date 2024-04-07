import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { TitleService } from '@delon/theme';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { ResetPasswordDto, TaiKhoanNoAuthServiceProxy } from '@service-proxies/tai-khoan-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';

@Component({
  selector: 'register',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.less'],
})
export class ResetPasswordComponent implements OnInit {
  rfDataModal: FormGroup;
  formSubmit$ = new Subject<any>();
  $destroy = new Subject<boolean>();
  isVisible = false;
  userId = '';
  tenantId = '';
  resetToken = '';

  constructor(private fb: FormBuilder,
              private _dataService: TaiKhoanNoAuthServiceProxy,
              private titleSrv: TitleService,
              private router: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('Đặt lại mật khẩu');
    if (this.router.snapshot.queryParams) {
      this.userId = this.router.snapshot.queryParams.userId;
      this.tenantId = this.router.snapshot.queryParams.tenantId;
      this.resetToken = this.router.snapshot.queryParams.resetToken;
    }
    this.rfDataModal = this.fb.group({
      // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')
      password: ['', [Validators.required]],
      passwordRe: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.rfDataModal.invalid) {
      ora.notify.error('Vui lòng xem lại thông tin form');
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      if (this.rfDataModal.get('password').value === this.rfDataModal.get('passwordRe').value) {
        if (this.userId && this.userId.length === 36) {//Đúng kiểu Guid
          ora.ui.setBusy();
          let input = new ResetPasswordDto();
          input.userId = this.userId;
          input.password = this.rfDataModal.value.password;
          input.resetToken = this.resetToken;
          this._dataService.resetPassword(input)
            .pipe(finalize(ora.ui.clearBusy))
            .subscribe((res) => {
              if (res) {
                if (res.isSuccessful) {
                  this.isVisible = true;
                } else {
                  ora.notify.error(res.errorMessage);
                }
              } else {
                ora.notify.error(res.errorMessage);
              }
            });
        } else {
          ora.notify.error('Thông tin không hợp lệ!!');
        }
      } else {
        ora.notify.error('Mật khẩu không trùng khớp!!');
      }

    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  openModal() {
    this.isVisible = true;
  }

  handleLogin() {
    this.isVisible = false;
  }
}
