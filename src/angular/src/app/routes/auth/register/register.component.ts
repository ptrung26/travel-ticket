import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateOrUpdateSysUserDto, CreateOrUpdateUserRequest, TaiKhoanBaseCustomServiceProxy } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { TitleService } from '@delon/theme';
import { Subject } from 'rxjs';
import { filter, finalize, startWith, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  rfDataModal: FormGroup;
  formSubmit$ = new Subject<any>();
  $destroy = new Subject<boolean>();
  isVisible = false;
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private _dataService: TaiKhoanBaseCustomServiceProxy, private _title: TitleService) { }

  ngOnInit(): void {
    this._title.setTitle("Đăng ký tài khoản");
    this.rfDataModal = this.fb.group({
      userName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      matKhau: ["", [Validators.required]],
    });
    this.formSubmit$
      .pipe(
        tap(() => {
          if (this.rfDataModal.pending) {
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
              this.rfDataModal.controls[i].markAsDirty();
              this.rfDataModal.controls[i].updateValueAndValidity();
            }
          }
        }),
        switchMap(() =>
          this.rfDataModal.statusChanges.pipe(
            startWith(this.rfDataModal.status),
            filter((status) => status !== 'PENDING'),
            take(1),
          ),
        ),
      )
      .subscribe((validation) => {
        if (validation === 'VALID') {
        } else {
          ora.notify.error('Vui lòng kiểm tra lại thông tin!');
        }
      });

  }


  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  submitForm(): void {
    if (this.rfDataModal.invalid) {
      ora.notify.error('Vui lòng xem lại thông tin form');
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {

      const formValue = this.rfDataModal.value;
      const input = new CreateOrUpdateUserRequest();
      let userDto = new CreateOrUpdateSysUserDto();
      userDto.email = formValue.email;
      userDto.userName = formValue.userName;
      userDto.matKhau = formValue.matKhau;
      input.userDto = userDto;
      input.arrRoleIds = [4];
      ora.ui.setBusy();
      this._dataService.createOrUpdateUser(input).pipe(finalize(() => {
        ora.ui.clearBusy();
      })).subscribe(res => {
        if (res.isSuccessful) {
          ora.notify.success('Đăng ký tài khoản thành công');
          this.isVisible = true;
        } else {
          ora.notify.error(res.errorMessage);
        }
      })

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
