import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CreateOrEditCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/create-or-update-cong-viec/create-or-edit-cong-viec.component';
import { FormBuilder, FormGroup, Validators } from '@node_modules/@angular/forms';
import { finalize } from '@node_modules/rxjs/internal/operators';
import {
  CongViecDto,
  CongViecUserDto,
  DanhSachCongViecServiceProxy,
  DeleteCongViecRequest,
  LEVEL_CONG_VIEC,
  MUC_DO_CONG_VIEC,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { AppComponentBase } from '@shared/common/AppComponentBase';

@Component({
  selector: 'cong-viec-truong-phong-lanh-dao-board',
  templateUrl: './cong-viec-truong-phong-lanh-dao-board.component.html',
  styleUrls: ['./cong-viec-truong-phong-lanh-dao-board.component.scss'],
})
export class CongViecTruongPhongLanhDaoBoardComponent extends AppComponentBase implements OnInit {
  @Input() listCongViec: CongViecDto[] = [];
  @Input() listUserCaNhan: CongViecUserDto[] = [];
  @Input() duAn: CongViecDto;
  @Input() permission: any;
  @Input() trangThai: TRANG_THAI_CONG_VIEC;
  @Output() refreshEvent = new EventEmitter<void>();
  @Output() sortingEvent = new EventEmitter<CongViecDto[]>();

  isVisibleForm = false;
  MUC_DO_CONG_VIEC = MUC_DO_CONG_VIEC;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  bodyElement = document.body;
  formGroup: FormGroup;

  constructor(injector: Injector, private _fb: FormBuilder, private _dataService: DanhSachCongViecServiceProxy) {
    super(injector);
    this.formGroup = this._fb.group({
      ten: ['', [Validators.required]],
      jsonTaiLieu: [],
      listIdThanhVien: [],
    });
  }

  ngOnInit(): void { }

  delete(event, item: CongViecDto) {
    event.stopPropagation();
    ora.message.confirm('Bạn có muốn xóa công việc này', 'Xóa công việc', () => {
      ora.ui.setBusy();
      const del = new DeleteCongViecRequest();
      del.id = item.id;
      this._dataService
        .deletecongviec(del)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((result) => {
          if (result.dataResult) {
            ora.notify.success('Xóa công việc thành công');
            this.refreshEvent.emit();
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
    });
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
      req.jsonTaiLieu = formValue.jsonTaiLieu;
      req.listUser = formValue.listIdThanhVien?.filter(id => id !== null).map((id) => {
        const item = new CongViecUserDto();
        item.sysUserId = id;
        return item;
      });
      req.parentId = this.duAn.id;
      req.trangThai = TRANG_THAI_CONG_VIEC.TAO_MOI;
      req.level = LEVEL_CONG_VIEC.CONG_VIEC;
      this._dataService
        .createorupdatecongviec(req)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((res) => {
          if (res.isSuccessful) {
            this.listCongViec.push(res.dataResult);
            this.sortingEvent.emit(this.listCongViec);
            this.formGroup.reset();
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    }
  }

  suaCongViec(data: CongViecDto) {
    this.modalHelper
      .create(
        CreateOrEditCongViecComponent,
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
      )
      .subscribe((result) => {
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
