import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import {
  CongViecDto,
  CreateOrUpdateCongViecRequest,
  DanhSachCongViecServiceProxy,
  DeleteCongViecRequest,
  LEVEL_CONG_VIEC,
  PagingCongViecRequest,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { CreateOrEditDuAnComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/create-or-update-du-an/create-or-edit-du-an.component';
import { ViewCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/view-cong-viec/view-cong-viec.component';

@Component({
  selector: 'cong-viec-ca-nhan',
  templateUrl: './cong-viec-ca-nhan.component.html',
  styleUrls: ['./cong-viec-ca-nhan.component.scss'],
})
export class CongViecCaNhanComponent extends PagedListingComponentBase<CongViecDto> implements OnInit {
  permission = {
    lanhDao: this.isGranted('CongViec.QuanLyCongViec.LanhDao'),
    truongPhong: this.isGranted('CongViec.QuanLyCongViec.TruongPhong'),
    nhanVien: this.isGranted('CongViec.QuanLyCongViec.NhanVien'),
  };
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  LEVEL_CONG_VIEC = LEVEL_CONG_VIEC;
  viewShow: 'list' | 'crud-cong-viec' = 'list';
  rfFormGroup: FormGroup;
  duAn: CongViecDto;
  api = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;

  constructor(injector: Injector, private _fb: FormBuilder, private _dataService: DanhSachCongViecServiceProxy) {
    super(injector);
    this.rfFormGroup = this._fb.group({
      filter: '',
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingCongViecRequest = new PagingCongViecRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.isGetMyJob = true;
    this._dataService
      .getlistcongvieccanhan(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  createOrUpdate(data?: CongViecDto) {
    this.modalHelper
      .create(
        CreateOrEditDuAnComponent,
        {
          duAn: data,
          permission: this.permission,
          isCaNhan: true,
        },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: data?.id ? 'Chỉnh sửa dự án' : 'Tạo mới dự án',
          },
        },
      )
      .subscribe((result) => {
        this.refresh();
      });
  }

  delete(data: CongViecDto) {
    ora.message.confirm('Bạn có muốn xóa dự án: ' + data.ten, 'Xóa dự án', () => {
      ora.ui.setBusy();
      const req = new DeleteCongViecRequest();
      req.id = data.id;
      this._dataService
        .deletecongviec(req)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((result) => {
          if (result.dataResult) {
            this.refresh();
            ora.notify.success('Xóa thành công dự án ' + data.ten);
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
    });
  }

  changeTrangThai(data: CongViecDto, trangThai: number) {
    if (trangThai === TRANG_THAI_CONG_VIEC.HOAN_THANH && (data.soViec !== data.soViecDaHoanThanh || !data.soViec)) {
      ora.notify.error('Các công việc nhỏ chưa hoàn thành!');
      return;
    }

    ora.ui.setBusy();
    let request = new CreateOrUpdateCongViecRequest();
    request = data;
    request.trangThai = trangThai;
    this._dataService
      .createorupdatecongviec(request)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        if (res.isSuccessful) {
          ora.notify.success('Thay đổi trạng thái thành công');
          this.refresh();
        } else {
          ora.notify.error(res.errorMessage);
        }
      });
  }

  viewCongViec(data: CongViecDto) {
    this.modalHelper
      .create(
        ViewCongViecComponent,
        {
          congViecId: data.id,
        },
        {
          size: 'lg',
          includeTabs: false,
          modalOptions: {
            nzTitle: 'Xem công việc ' + data.ten,
            nzClassName: 'view-cong-viec',
          },
        },
      )
      .subscribe((result) => { });
  }

  chiTietCongViec(data: CongViecDto) {
    this.viewShow = 'crud-cong-viec';
    this.duAn = data;
  }

  onBackToList() {
    this.viewShow = 'list';
    this.refresh();
  }

  getNzText(length: number) {
    return length > 2 ? '+' + (length - 2) : '';
  }
}
