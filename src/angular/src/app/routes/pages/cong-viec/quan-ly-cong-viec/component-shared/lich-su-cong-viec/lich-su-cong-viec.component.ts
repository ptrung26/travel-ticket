import { Component, Injector, Input, OnInit } from '@angular/core';
import {
  CongViecDto,
  CongViecLichSuDto,
  DanhSachCongViecServiceProxy,
  PagingLichSuCongViecRequest,
} from '@service-proxies/cong-viec-service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'lich-su-cong-viec',
  templateUrl: './lich-su-cong-viec.component.html',
})
export class LichSuCongViecComponent extends PagedListingComponentBase<CongViecLichSuDto> implements OnInit {
  @Input() congViec: CongViecDto;
  listItem: CongViecLichSuDto[] = [];
  sourceAvatar = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;

  constructor(
    injector: Injector,
    private _dataService: DanhSachCongViecServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const req = new PagingLichSuCongViecRequest();
    req.congViecId = this.congViec.id;
    req.skipCount = request.skipCount;
    req.maxResultCount = request.maxResultCount;
    this._dataService.paginghistory(req)
      .pipe(finalize(finishedCallback))
      .subscribe(res => {
        this.dataList = res.items;
        this.showPaging(res);
      });
  }
}

