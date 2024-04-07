import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validSDT } from '@app/shared/customValidator/validSDT';
import { ComboBoxDto } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  rfDataModal: FormGroup;
  // loaiHinhDoanhNghiep = LOAI_HINH_DOANH_NGHIEP;
  formSubmit$ = new Subject<any>();
  $destroy = new Subject<boolean>();
  isVisible = false;

  // private _dataServiceClient: KhachHangClientServiceProxy
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.rfDataModal = this.fb.group({
      maSoThue: ['', [Validators.required, Validators.minLength(10)]],
      ten: ['', [Validators.required]],
      hang: ['', [Validators.required]],
      // loaiHinhDoanhNghiep: [this.loaiHinhDoanhNghiep.TU_NHAN, [Validators.required]],
      tinhId: ['', [Validators.required]],
      tenTinh: ['', [Validators.required]],
      huyenId: ['', [Validators.required]],
      xaId: ['', [Validators.required]],
      soNha: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dienThoai: ['', [Validators.required, validSDT]],
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

    this.rfDataModal
      .get('tinhId')
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.$destroy))
      .subscribe((res) => {
        if (!res) {
          this.rfDataModal.get('huyenId').setValue(null);
          this.rfDataModal.get('xaId').setValue(null);
        }
      });

    this.rfDataModal
      .get('huyenId')
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.$destroy))
      .subscribe((res) => {
        if (!res) {
          this.rfDataModal.get('xaId').setValue(null);
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
      ora.ui.setBusy();
      // this._dataServiceClient
      //   .khachHangDangKy(this.rfDataModal.value)
      //   .pipe(finalize(ora.ui.clearBusy))
      //   .subscribe((res) => {
      //     if (res.isSuccessful) {
      //       ora.notify.success('Đăng ký tài khoản thành công');
      //       this.isVisible = true;
      //       this.rfDataModal.reset();
      //     } else {
      //       ora.notify.error(res.errorMessage);
      //     }
      //   });
    }
  }

  changeTinh(event: ComboBoxDto) {
    this.rfDataModal.get('tenTinh').setValue(event.displayText);
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
