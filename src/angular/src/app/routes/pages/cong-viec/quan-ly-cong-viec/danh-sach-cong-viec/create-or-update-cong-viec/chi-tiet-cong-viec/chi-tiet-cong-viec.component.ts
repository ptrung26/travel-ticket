import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CrudChiTietCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/create-or-update-cong-viec/chi-tiet-cong-viec/crud-chi-tiet-cong-viec/crud-chi-tiet-cong-viec.component';
import { DestroyRxjsService } from '@node_modules/@orendaco/of';
import {
  CongViecDto,
  CreateOrUpdateCongViecRequest,
  DanhSachCongViecServiceProxy,
  DeleteCongViecRequest,
  LEVEL_CONG_VIEC,
  PagingCongViecRequest,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { UploadFileDinhKemModalComponent } from './upload-file-modal/upload-file-dinh-kem-modal.component';

@Component({
  selector: 'chi-tiet-cong-viec',
  templateUrl: './chi-tiet-cong-viec.component.html',
  styleUrls: ['./chi-tiet-cong-viec.component.scss'],
  providers: [DestroyRxjsService],
})
export class ChiTietCongViecComponent extends PagedListingComponentBase<CongViecDto> implements OnInit {
  @Input() congViec: CongViecDto;
  @Input() duAnId: number;
  @Input() permission: any;
  @Output() refreshCongViec = new EventEmitter<any>();
  @Output() refreshLichSu = new EventEmitter<any>();

  sourceAvatar = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;

  constructor(
    injector: Injector,
    private _dataService: DanhSachCongViecServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
    console.log(this.permission.truongPhong && this.congViec?.trangThai < TRANG_THAI_CONG_VIEC.PHE_DUYET);
    console.log(!this.permission.lanhDao &&
      ((this.permission.nhanVien && this.congViec?.trangThai < TRANG_THAI_CONG_VIEC.CHO_PHE_DUYET) ||
        (this.permission.truongPhong && this.congViec?.trangThai < TRANG_THAI_CONG_VIEC.PHE_DUYET)));
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingCongViecRequest = new PagingCongViecRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    input.parentId = this.congViec.id;
    input.isGetMyJob = this.permission.nhanVien || this.permission.truongPhong;
    input.level = LEVEL_CONG_VIEC.MUC_VIEC_NHO;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  createOrUpdate(data?: CongViecDto) {
    this.modalHelper
      .create(
        CrudChiTietCongViecComponent,
        {
          congViecNho: data,
          congViec: this.congViec,
          permission: this.permission,
          duAnId: this.duAnId,
        },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: data?.id ? 'Sửa công việc: ' + data.ten : 'Thêm công việc',
          },
        },
      )
      .subscribe((result) => {
        this.refresh();
        this.refreshCongViec.emit();
        this.refreshLichSu.emit();
      });
  }

  deleteCongViec(data: any) {
    ora.message.confirm(
      'Bạn có muốn xóa công việc ' + data.ten,
      'Xóa công việc',
      () => {
        ora.ui.setBusy();
        let req = new DeleteCongViecRequest();
        req.id = data.id;
        this._dataService.deletecongviec(req)
          .pipe(finalize(() => {
            ora.ui.clearBusy();
          }))
          .subscribe(res => {
            if (res.dataResult) {
              ora.notify.success('Xóa công việc thành công');
              this.refresh();
            } else {
              ora.notify.error(res.errorMessage);
            }
          });
      },
    );
  }

  getNzText(length: number) {
    return length > 2 ? ('+' + (length - 2)) : '';
  }

  upload(data: CongViecDto, onlyView: boolean = false) {
    this.modalHelper
      .create(
        UploadFileDinhKemModalComponent,
        { dataItem: data, onlyView: onlyView },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: 'Upload tệp đính kèm'
          },
        },
      )
      .subscribe((result) => {
        console.log(result);
        if (result) {
          ora.ui.setBusy();
          const req = new CreateOrUpdateCongViecRequest();
          Object.assign(req, data);
          req.jsonTaiLieu = result;
          this._dataService.createorupdatecongviec(req).subscribe(res => {
            ora.ui.clearBusy();
            if (!res.isSuccessful) {
              ora.notify.error(res.errorMessage);
            } else {
              ora.notify.success('Thêm tệp đính kèm thành công');
            }
          })

        }

      });
  }
}

