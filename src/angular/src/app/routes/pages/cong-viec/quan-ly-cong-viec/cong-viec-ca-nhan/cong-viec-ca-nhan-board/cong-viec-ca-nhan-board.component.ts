import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import {
  CommonServiceProxy,
  CongViecDto,
  CongViecUserDto,
  DanhSachCongViecServiceProxy,
  DeleteCongViecRequest,
  LEVEL_CONG_VIEC,
  MUC_DO_CONG_VIEC,
  ROLE_CONG_VIEC,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { FormBuilder, FormGroup, Validators } from '@node_modules/@angular/forms';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { AppConsts } from '@shared/AppConsts';
import { ViewCongViecCaNhanComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/cong-viec-ca-nhan/view-cong-viec-ca-nhan/view-cong-viec-ca-nhan.component';

@Component({
  selector: 'cong-viec-ca-nhan-board',
  templateUrl: './cong-viec-ca-nhan-board.component.html',
  styleUrls: ['./cong-viec-ca-nhan-board.component.scss'],
})
export class CongViecCaNhanBoardComponent extends AppComponentBase implements OnInit {
  @Input() listCongViec: CongViecDto[] = [];
  @Input() duAn: CongViecDto;
  @Input() permission: any;
  @Input() trangThai: TRANG_THAI_CONG_VIEC;
  @Output() refreshEvent = new EventEmitter<void>();

  isVisibleForm = false;
  MUC_DO_CONG_VIEC = MUC_DO_CONG_VIEC;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  bodyElement = document.body;
  listUser: CongViecUserDto[] = [];
  formGroup: FormGroup;

  constructor(injector: Injector,
              private _fb: FormBuilder,
              private _commonService: CommonServiceProxy,
              private _dataService: DanhSachCongViecServiceProxy) {
    super(injector);
    this.formGroup = this._fb.group({
      ten: ['', Validators.required],
      idNhanVien: [],
    });
  }

  ngOnInit(): void {
    this.getUserNhanVien();
  }

  getUserNhanVien() {
    ora.ui.setBusy();
    this._commonService
      .userCongViec(ROLE_CONG_VIEC.NHAN_VIEN)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        this.listUser = res.map(data => {
          data.anhDaiDien = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${data.userId}`;
          return data;
        });
      });
  }

  delete(event, item: CongViecDto) {
    event.stopPropagation();
    ora.message.confirm(
      'Bạn có muốn xóa công việc này',
      'Xóa công việc',
      () => {
        ora.ui.setBusy();
        const del = new DeleteCongViecRequest();
        del.id = item.id;
        this._dataService.deletecongviec(del).pipe(finalize(() => {
          ora.ui.clearBusy();
        })).subscribe((result) => {
          if (result.dataResult) {
            ora.notify.success('Xóa công việc thành công');
            this.refreshEvent.emit();
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
      },
    );
  }

  add() {
    if (this.formGroup.invalid) {
      ora.notify.error(this.l('Vui lòng kiểm tra lại thông tin'));
      for (const i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      ora.ui.setBusy();
      const formValue = this.formGroup.value;
      const req = new CongViecDto();
      req.id = 0;
      req.ten = formValue.ten;
      if (formValue.idNhanVien) {
        const user = new CongViecUserDto();
        user.sysUserId = formValue?.idNhanVien;
        req.listUser = [user];
      }
      req.parentId = this.duAn.id;
      req.trangThai = TRANG_THAI_CONG_VIEC.TAO_MOI;
      req.level = LEVEL_CONG_VIEC.CONG_VIEC;
      req.isCaNhan = true;
      this._dataService.createorupdatecongviec(req)
        .pipe(finalize(() => {
          ora.ui.clearBusy();
        }))
        .subscribe(res => {
          if (res.isSuccessful) {
            this.listCongViec.push(res.dataResult);
            this.formGroup.reset();
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    }
  }

  suaCongViec(data: CongViecDto) {
    this.modalHelper.create(
      ViewCongViecCaNhanComponent,
      {
        congViec: data,
        duAnId: this.duAn.id,
        permission: this.permission,
      },
      {
        size: 1300,
        includeTabs: false,
        modalOptions: {
          nzTitle: 'Chi tiết công việc',
        },
      },
    ).subscribe((result) => {
      this.refreshEvent.emit();
    });

  }


  cancel() {
    this.isVisibleForm = false;
  }

  changeVisibleForm() {
    this.isVisibleForm = true;
  }

  dragStart($event) {
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.setProperty('cursor', 'grabbing', 'important');
  }

}
