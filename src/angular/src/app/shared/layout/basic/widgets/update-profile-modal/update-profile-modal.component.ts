import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@node_modules/@angular/forms';
import {ModalComponentBase} from '@shared/common/modal-component-base';
import {TaiKhoanBaseCustomServiceProxy} from '@service-proxies/tai-khoan-service-proxies';
import {finalize} from 'rxjs/operators';

@Component({
  templateUrl: './update-profile-modal.component.html',
  styleUrls: ['./update-profile-modal.component.scss'],
})
export class UpdateProfileModalComponent extends ModalComponentBase implements OnInit {
  rfDataModal: FormGroup;
  loading = true;
  userSession: any;
  constructor(private injector: Injector, private fb: FormBuilder, private _dataService: TaiKhoanBaseCustomServiceProxy) {
    super(injector);
    this.rfDataModal = this.fb.group({
      // userName: [undefined, [Validators.required]],
      email: [undefined, [Validators.email, Validators.required]],
      hoTen: [undefined, [Validators.required]],
      soDienThoai: [],
    });
  }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('userSession'));
    this._dataService.getUserInfo(this.userSession?.userId).subscribe((res) => {
      if (res != null) {
        this.rfDataModal.get('email').setValue(res.dataResult.email);
        this.rfDataModal.get('hoTen').setValue(res.dataResult.hoTen);
        this.rfDataModal.get('soDienThoai').setValue(res.dataResult.soDienThoai);
      }
    });
    this.loading = false;
  }

  save() {
    if (this.rfDataModal.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
    } else {
      ora.ui.setBusy();
      const fValue = this.rfDataModal.value;
      this._dataService
        .userUpdateInfo(fValue)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((result) => {
          if (result.isSuccessful) {
            this.success('Cập nhật thông tin tài khoản thành công!');
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
    }
  }
}
