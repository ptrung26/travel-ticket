import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import {
  CommonServiceProxy,
  CongViecDto,
  CongViecUserDto,
  CreateOrUpdateCongViecRequest,
  DanhSachCongViecServiceProxy,
  DeleteCongViecRequest,
  LEVEL_CONG_VIEC,
  MUC_DO_CONG_VIEC,
  PagingCongViecRequest,
  ROLE_CONG_VIEC,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConsts } from '@app/shared/AppConsts';
import { DestroyRxjsService } from '@node_modules/@orendaco/of';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { CreateOrEditDuAnComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/create-or-update-du-an/create-or-edit-du-an.component';
import { ViewCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/view-cong-viec/view-cong-viec.component';
import _ from 'lodash';

@Component({
  templateUrl: './danh-sach-cong-viec.component.html',
  styleUrls: ['./danh-sach-cong-viec.component.scss'],
  providers: [DestroyRxjsService],
})
export class DanhSachCongViecComponent extends PagedListingComponentBase<CongViecDto> implements OnInit, AfterViewInit {
  permission = {
    lanhDao: this.isGranted('CongViec.QuanLyCongViec.LanhDao'),
    truongPhong: this.isGranted('CongViec.QuanLyCongViec.TruongPhong'),
    nhanVien: this.isGranted('CongViec.QuanLyCongViec.NhanVien'),
  };

  viewShow: 'list' | 'crud-cong-viec' | 'crud-cong-viec-nhan-vien' = 'list';
  duAn: CongViecDto;
  rfFormGroup: FormGroup;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  LEVEL_CONG_VIEC = LEVEL_CONG_VIEC;
  api = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;
  listNguoiGiao = [];

  constructor(private injector: Injector, private _cdf: ChangeDetectorRef,
    private _dataService: DanhSachCongViecServiceProxy,
    private fb: FormBuilder, private _commonService: CommonServiceProxy) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
      fromDate: null,
      toDate: null,
      mucDo: null,
      sysUserId: null,
    });
  }

  ngOnInit(): void {
    this.refresh();

    if (this.permission.nhanVien || this.permission.truongPhong) {
      this.getAllNguoiGiao();
    }

    this._dataService.guicanhbaocongviecdenhan().subscribe(res => {
      console.log(res);
    })
  }

  ngAfterViewInit() {
    let boxFilterElement = document.querySelector('.box-filter') ?
      document.querySelector('.box-filter') as HTMLDivElement : document.querySelector('ora-layout-filter') as any;
    let headElement = document.querySelector('thead');
    this.scroll.y = this.bodyElement.offsetHeight - boxFilterElement.offsetHeight - this.heightNavbarPagging - 50 - headElement.clientHeight + 'px';
    this._cdf.detectChanges();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingCongViecRequest = new PagingCongViecRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.level = LEVEL_CONG_VIEC.DU_AN;
    input.isGetMyJob = true;
    input.fromDate = formValue.fromDate;
    input.toDate = formValue.toDate;
    input.mucDo = formValue.mucDo
    input.sysUserId = formValue.sysUserId;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  createOrUpdate(data?: CongViecDto, isView?: boolean, isClone?: boolean) {
    let title = isView ? 'Thông tin dự án' : 'Chi tiết dự án';
    if (!isView && this.permission.lanhDao && data) {
      if (isClone) {
        title = 'Nhân bản dự án';
      }
      else {
        title = 'Sửa dự án';
      }
    } else if (!isView && this.permission.lanhDao && !data) {
      title = 'Dự án mới';
    }

    this.modalHelper.create(
      CreateOrEditDuAnComponent,
      {
        duAn: data,
        isView: isView,
        permission: this.permission,
        isClone: isClone
      },
      {
        size: 'md',
        includeTabs: false,
        modalOptions: {
          nzTitle: title,
        },
      },
    ).subscribe((result) => {
      this.refresh();
    });
  }

  cloneDuAn(data: CongViecDto) {

    let cloneData = _.cloneDeep(data);
    this.createOrUpdate(cloneData, false, true);

  }

  delete(data: CongViecDto) {
    ora.message.confirm(
      'Bạn có muốn xóa dự án: ' + data.ten,
      'Xóa dự án',
      () => {
        ora.ui.setBusy();
        const req = new DeleteCongViecRequest();
        req.id = data.id;
        this._dataService.deletecongviec(req).pipe(finalize(() => {
          ora.ui.clearBusy();
        })).subscribe((result) => {
          if (result.dataResult) {
            this.refresh();
            ora.notify.success('Xóa thành công dự án ' + data.ten);
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
      },
    );
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
    this._dataService.createorupdatecongviec(request)
      .pipe(finalize(() => {
        ora.ui.clearBusy();
      }))
      .subscribe(res => {
        if (res.isSuccessful) {
          ora.notify.success('Thay đổi trạng thái thành công');
          this.refresh();
        } else {
          ora.notify.error(res.errorMessage);
        }
      });
  }

  viewCongViec(data: CongViecDto) {
    this.modalHelper.create(
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
    ).subscribe((result) => {

    });
  }

  onBackToList() {
    this.viewShow = 'list';
    this.refresh();
  }

  chiTietCongViec(data: CongViecDto) {
    this.viewShow = this.permission.nhanVien ? 'crud-cong-viec-nhan-vien' : 'crud-cong-viec';
    this.duAn = data;
  }

  getNzText(length: number) {
    return length > 2 ? ('+' + (length - 2)) : '';
  }

  getAllNguoiGiao() {
    let _permission: number = null;

    if (this.permission.nhanVien) {
      _permission = ROLE_CONG_VIEC.TRUONG_PHONG;
    } else {
      _permission = ROLE_CONG_VIEC.LANH_DAO;
    }

    this._commonService.userCongViec(_permission).subscribe((res: CongViecUserDto[]) => {
      this.listNguoiGiao = res?.map((item) => ({
        value: item.id,
        displayText: item.hoTen,
      }));
    });
  }
}


