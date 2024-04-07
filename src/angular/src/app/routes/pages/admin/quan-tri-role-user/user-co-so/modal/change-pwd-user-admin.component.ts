
import { Component, Input, ViewChild } from '@angular/core';
import { TaiKhoanBaseCustomServiceProxy } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DynamicFormPageComponent, OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';

@Component({
  template: `
      <div>
          <ord-dynamic-form #vcForm [(dataForm)]="record" [listOfFormItems]="forms"></ord-dynamic-form>
      </div>
      <div *nzModalFooter>
          <button nz-button nzType="primary" (click)="save()">Lưu</button>
          <button nz-button nzType="default" (click)="destroyModal()">Đóng</button>
      </div>    `
})
export class ChangePwdUserAdminComponent {
  @ViewChild('vcForm') vcForm: DynamicFormPageComponent;
  @Input() id = 0;
  @Input() record: any;
  forms: OrdFormItem[] = [
    {
      label: 'Cơ sở',
      dataField: 'tenCoSo',
      type: 'text',
      width: 24,
      disabled: true
    },
    {
      label: 'Họ tên',
      placeholder: 'Họ tên đầy đủ người dùng',
      dataField: 'hoTen',
      maxlength: 500,
      type: 'text',
      disabled: true,
      width: 24
    },
    {
      label: 'Tên đăng nhập',
      dataField: 'userName',
      type: 'text',
      width: 24,
      disabled: true
    },
    {
      label: 'Mật khẩu cũ',
      placeholder: 'Nhập mật khẩu cũ',
      dataField: 'matKhauCu',
      maxlength: 100,
      type: 'password',
      required: true,
      width: 24,
      errEmpty: 'Nhập mật khẩu cũ',
      validate: [
        {
          type: 'password'
        }
      ]
    },
    {
      label: 'Mật khẩu',
      placeholder: 'Mật khẩu đăng nhập hệ thống',
      dataField: 'matKhau',
      maxlength: 100,
      type: 'password',
      required: true,
      width: 24,
      errEmpty: 'Nhập mật khẩu cần đổi',
      validate: [
        {
          type: 'password'
        }
      ]
    },
    {
      label: 'Nhập lại mật khẩu',
      placeholder: 'Nhập lại mật khẩu',
      dataField: 'matKhauNhapLai',
      maxlength: 100,
      type: 'password',
      required: true,
      width: 24,
      errEmpty: 'Nhập lại mật khẩu cần đổi',
      validate: [
        {
          type: 'password'
        }
      ]
    }
  ];

  constructor(private modal: NzModalRef,
    private taiKhoanSp: TaiKhoanBaseCustomServiceProxy) {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  save() {

    const d = this.vcForm.getDataForm();
    if (d.matKhau != d.matKhauNhapLai) {
      ora.notify.error('Mật khẩu nhập lại chưa chính xác !');
      return;
    }
    if (d === null) {
      ora.notify.error('Điền đầy đủ thông tin');
      return;
    }
    ora.ui.setBusy();
    this.taiKhoanSp.doiMatKhau({
      sysUserId: this.id,
      userIdentityId: d.userId,
      matKhauMoi: d.matKhau,
      matKhauCu: d.matKhauCu,
    } as any)
      .pipe(finalize(ora.ui.clearBusy))
      .subscribe((res) => {
        if (res.isSuccessful) {
          ora.notify.info('Đổi mật khẩu tài khoản thành công');
          this.modal.close();
        }
        else {
          ora.notify.error(res.errorMessage);
          return;
        }
      });
  }
}
