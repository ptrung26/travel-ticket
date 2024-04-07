import { Component, Injector, Input, OnInit } from '@angular/core';
import {
  CongViecDto,
  CreateOrUpdateTraoDoiRequest,
  DanhSachCongViecServiceProxy,
  DeleteTraoDoiCongViecRequest,
  PagingCongViecTraoDoiRequest,
  TraoDoiCongViecDto,
} from '@service-proxies/cong-viec-service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { finalize } from '@node_modules/rxjs/internal/operators';

@Component({
  selector: 'trao-doi-cong-viec',
  templateUrl: './trao-doi-cong-viec.component.html',
  styleUrls: ['../../danh-sach-cong-viec/create-or-update-cong-viec/create-or-edit-cong-viec.component.scss'],
})
export class TraoDoiCongViecComponent extends PagedListingComponentBase<TraoDoiCongViecDto> implements OnInit {
  @Input() congViec: CongViecDto;
  rfFormData: FormGroup;
  sourceAvatar = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private _dataService: DanhSachCongViecServiceProxy,
  ) {
    super(injector);
    this.rfFormData = this.fb.group({
      noiDung: [],
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const req = new PagingCongViecTraoDoiRequest();
    req.skipCount = request.skipCount;
    req.sorting = request.sorting;
    req.maxResultCount = request.maxResultCount;
    req.congViecId = this.congViec.id;
    this._dataService
      .pagingtraodoirequest(req)
      .pipe(finalize(finishedCallback))
      .subscribe(res => {
        this.dataList = res.items;
        this.showPaging(res);
      });
  }

  post() {
    ora.ui.setBusy();
    const input = new CreateOrUpdateTraoDoiRequest();
    input.congViecId = this.congViec.id;
    input.parentId = 0;
    input.noiDung = this.rfFormData.get('noiDung').value;
    input.isMyPost = true;
    this._dataService.createorupdatetraodoirequest(input)
      .pipe(finalize(() => {
        ora.ui.clearBusy();
      }))
      .subscribe(res => {
        if (res.isSuccessful === true) {
          ora.notify.success('Thêm mới nội dung trao đổi thành công!');
          this.refresh();
          this.rfFormData.reset();
        } else {
          ora.notify.error(res.errorMessage);
        }
      });
  }

  delete(data: TraoDoiCongViecDto) {
    ora.message.confirm(
      'Bạn có muốn xóa nội dung trao đổi này',
      'Xóa trao đổi',
      () => {
        ora.ui.setBusy();
        const req = new DeleteTraoDoiCongViecRequest();
        req.id = data.id;
        this._dataService.deletetraodoi(req)
          .pipe(finalize(() => {
            ora.ui.clearBusy();
          }))
          .subscribe((result) => {
            if (result.isSuccessful) {
              ora.notify.success('Xóa nội dung thành công');
              this.refresh();
            } else {
              ora.notify.error(result.errorMessage);
            }
          });
      },
    );
  }
}
