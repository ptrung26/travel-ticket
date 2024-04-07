import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { CreateOrEditTinhComponent } from '@app/routes/pages/danh-muc/tinh/create-or-edit.component';
import {
  DanhMucTinhServiceProxy,
  TinhDto,
  TinhPagedRequestDto,
  PagingDanhMucTinhRequest,
  ExportDanhMucTinhRequest,
} from '@service-proxies/danh-muc-service-proxies';
import { SessionKey } from '@sessionKey/*';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { UpLoadTinhComponent } from './up-load-tinh/up-load-tinh.component';

@Component({
  templateUrl: './tinh.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class TinhComponent extends PagedListingComponentBase<TinhDto> implements OnInit {
  rfFormGroup: FormGroup;

  constructor(injector: Injector, private _dataService: DanhMucTinhServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.setTitleTab('Danh mục Tỉnh/Thành phố');
    this.rfFormGroup = this.fb.group({
      filter: '',
    });
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: TinhPagedRequestDto = new TinhPagedRequestDto();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  clear() {
    this.rfFormGroup.reset();
    this.refresh();
  }

  showCreateOrEditModal(dataItem?: TinhDto): void {
    this.modalHelper
      .create(
        CreateOrEditTinhComponent,
        { dataItem: dataItem },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: dataItem ? 'Sửa thông tin tỉnh/thành phố: ' + dataItem.ten : 'Thêm mới tỉnh/thành phố',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
          sessionStorage.removeItem(SessionKey.danhMucTinh);
        }
      });
  }

  delete(dataItem: any): void {
    ora.message.confirm('', 'Bạn có chắc chắn muốn xóa ' + dataItem.cap + ' ' + dataItem.ten + ' ?', () => {
      this._dataService.removebyid(dataItem.id).subscribe(() => {
        this.refresh();
        sessionStorage.removeItem(SessionKey.danhMucTinh);
        ora.notify.success('Xóa dữ liệu thành công!');
      });
    });
  }

  onClickUpload(data: any) {
    this.modalHelper
      .create(
        UpLoadTinhComponent,
        { dataInput: data },
        {
          size: 'xl',
          includeTabs: true,
          modalOptions: {
            nzTitle: 'Import danh mục tỉnh',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  changeTinhGan(dataItem: TinhDto) {
    let check = !dataItem.isTinhGan;
    dataItem.isTinhGan = !dataItem.isTinhGan;
    this._dataService.changeTinhGan(check, dataItem.id).subscribe((data) => {
      if (data.isSuccessful) {
        ora.notify.success(check ? 'Đặt tỉnh gần thành công!' : 'Đặt tỉnh xa thành công!');
        // this.refresh();
      } else {
        ora.notify.error(data.errorMessage);
      }
    });
  }

  exportExcel() {
    ora.ui.setBusy();
    const filterInput = new PagingDanhMucTinhRequest();
    const formValue = this.rfFormGroup.value;
    filterInput.filter = formValue.filter;
    filterInput.sorting = this.sorting;

    const input = new ExportDanhMucTinhRequest();
    input.filterInput = filterInput;

    this._dataService
      .exportExcelDanhMucTinh(input)
      .pipe(finalize(() => ora.ui.clearBusy()))
      .subscribe(
        (result) => {
          ora.downloadFile(UrlServices.danhMucUrl(), ApiNameConfig.danhMuc.apiName, result.fileToken);
        },
        (err) => {
          console.log(err);
        },
      );
  }

  deleteAll() {
    ora.message.confirm('', 'Bạn có chắc chắn muốn xóa tất cả các tỉnh/thành phố không ?', () => {
      ora.ui.setBusy();
      this._dataService
        .all()
        .pipe(finalize(ora.ui.clearBusy))
        .subscribe((res) => {
          if (res.isSuccessful) {
            this.refresh();
            ora.notify.success('Thao tác thành công');
          } else {
            ora.notify.error('Có lỗi xảy ra');
          }
        });
    });
  }
}
