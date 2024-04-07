import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitleService } from '@delon/theme';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { Subject } from 'rxjs';
import { TaiKhoanNoAuthServiceProxy } from '@service-proxies/tai-khoan-service-proxies';

@Component({
  selector: 'register',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.less'],
})
export class ForgotPasswordComponent implements OnInit {
  rfDataModal: FormGroup;
  formSubmit$ = new Subject<any>();
  $destroy = new Subject<boolean>();
  isVisible = false;

  constructor(private fb: FormBuilder, private _dataService: TaiKhoanNoAuthServiceProxy, private titleSrv: TitleService) {
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('Quên mật khẩu');

    this.rfDataModal = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      appName: ['newPMS'],
      returnUrl: [''],
      returnUrlHash: [''],
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
      ora.ui.setBusy();
      this._dataService
        .sendPasswordResetCode(this.rfDataModal.value)
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
