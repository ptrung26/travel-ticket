import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CreateOrEditHuyenComponent } from '@app/routes/pages/danh-muc/huyen/create-or-edit.component';
import { finalize } from '@node_modules/rxjs/operators';
import {
  DanhMucHuyenServiceProxy,
  ExportDanhMucHuyenRequest,
  HuyenDto,
  HuyenPagedRequestDto,
  PagingDanhMucHuyenRequest,
} from '@service-proxies/danh-muc-service-proxies';
import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';
import { SessionKey } from '@sessionKey/*';
import { PagedListingComponentBase } from '@shared/common/paged-listing-component-base';
import { UpLoadHuyenComponent } from './up-load-huyen/up-load-huyen.component';

@Component({
  templateUrl: './huyen.component.html',
})
export class HuyenComponent extends PagedListingComponentBase<HuyenDto> implements OnInit {
  rfFormGroup: FormGroup;

  constructor(injector: Injector, private _dataService: DanhMucHuyenServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
      tinhId: [],
    });
  }

  protected fetchDataList(request: HuyenPagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: HuyenPagedRequestDto = new HuyenPagedRequestDto();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.tinhId = formValue.tinhId;
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

  showCreateOrEditModal(dataItem?: HuyenDto): void {
    this.modalHelper
      .create(
        CreateOrEditHuyenComponent,
        { dataItem: dataItem ? dataItem : undefined },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: dataItem ? 'Sửa thông tin quận/huyện: ' + dataItem.ten : 'Thêm mới quận/huyện',
          },
        },
      )
      .subscribe((result: HuyenDto) => {
        if (result) {
          this.refresh();
          sessionStorage.removeItem(SessionKey.danhMucHuyen + '_' + result.tinhId);
        }
      });
  }

  delete(dataItem: HuyenDto): void {
    ora.message.confirm('', 'Bạn có chắc chắn muốn xóa ' + dataItem.cap + ' ' + dataItem.ten + ' ?', () => {
      this._dataService.removebyid(dataItem.id).subscribe(() => {
        this.refresh();
        sessionStorage.removeItem(SessionKey.danhMucHuyen + '_' + dataItem.tinhId);
        ora.notify.success('Xóa dữ liệu thành công!');
      });
    });
  }

  onClickUpload(data: any) {
    this.modalHelper
      .create(
        UpLoadHuyenComponent,
        { dataInput: data },
        {
          size: 1024,
          includeTabs: true,
          modalOptions: {
            nzTitle: 'Import danh mục huyện',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  exportExcel() {
    const filterInput = new PagingDanhMucHuyenRequest();
    const formValue = this.rfFormGroup.value;
    filterInput.filter = formValue.filter;
    filterInput.sorting = this.sorting;

    const input = new ExportDanhMucHuyenRequest();
    input.filterInput = filterInput;

    this._dataService
      .exportExcelDanhMucHuyen(input)
      .pipe(finalize(() => ora.ui.clearBusy()))
      .subscribe((result) => {
        ora.downloadFile(UrlServices.danhMucUrl(), ApiNameConfig.danhMuc.apiName, result.fileToken);
      });
  }
}
