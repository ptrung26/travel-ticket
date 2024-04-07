import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from '@node_modules/rxjs/operators';

import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';
import { SessionKey } from '@sessionKey/*';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { CreateOrEditDanhMucComponent } from './create-or-edit.component';
import { UploadDanhMucComponent } from './up-load-danh-muc/upload-danh-muc.component';
import {
  CodeSystemDto,
  CodeSystemServiceProxy,
  ExportExcelCodeSystemRequest,
  PagingCodeSystemRequests,
} from '@app/shared/service-proxies/danh-muc-service-proxies';

@Component({
  selector: 'danh-muc',
  templateUrl: './danh-muc.component.html',
  styleUrls: ['./danh-muc.component.scss'],
})
export class DanhMucComponent extends PagedListingComponentBase<CodeSystemDto> implements OnInit {
  rfFormGroup: FormGroup;
  disExport = true;

  constructor(injector: Injector, private _dataService: CodeSystemServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
      parentCode: [],
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingCodeSystemRequests = new PagingCodeSystemRequests();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.parentCode = formValue.parentCode;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  modelChanged($event) {
    if ($event == undefined) {
      this.disExport = true;
    } else {
      this.disExport = false;
    }
    this.refresh();
  }

  showCreateOrEditModal(dataItem?: CodeSystemDto): void {
    const dissable = dataItem?.id && !dataItem.parentId;
    if (!dataItem?.id) {
      const formValue = this.rfFormGroup.value;
      dataItem = new CodeSystemDto();
      dataItem.parentCode = formValue.parentCode;
    }

    this.modalHelper
      .create(
        CreateOrEditDanhMucComponent,
        { dataItem: dataItem, dissable: dissable },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: dataItem?.id ? 'Sửa thông tin danh mục: ' + dataItem.display : 'Thêm mới danh mục',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  delete(dataItem: CodeSystemDto) {
    ora.message.confirm(
      '',
      this.l('Bạn có muốn xóa: ' + dataItem.display),
      () => {
        this._dataService.itemDelete(dataItem.id).subscribe(() => {
          this.refresh();
          sessionStorage.removeItem(SessionKey.danhMucChung + '_' + dataItem.id);
          ora.notify.success(this.l('DeleteSuccess'));
        });
      },
      () => {},
    );
  }

  deleteMultiItem(dataItems) {
    ora.message.confirm(
      'Bạn có chắc chắn muốn xóa danh mục ra khỏi danh sách không',
      'Xóa thông tin ' + this.selectedDataItems.length + ' danh mục',
      () => {
        this._dataService.multiDeleteItem(dataItems).subscribe(() => {
          this.refresh();
          for (let index = 0; index < dataItems.length; index++) {
            sessionStorage.removeItem(SessionKey.danhMucChung + '_' + dataItems[index].id);
          }
          ora.notify.success(this.l('DeleteSuccess'));
        });
      },
      () => {},
    );
  }

  exportExcel() {
    const filterInput = new PagingCodeSystemRequests();
    const formValue = this.rfFormGroup.value;
    filterInput.filter = formValue.filter;
    const input = new ExportExcelCodeSystemRequest();
    input.filterInput = filterInput;
    input.parentCode = formValue.parentCode;
    console.log(input);
    this._dataService
      .exportExcelDanhMucChung(input)
      .pipe(finalize(() => ora.ui.clearBusy()))
      .subscribe((result) => {
        ora.downloadFile(UrlServices.danhMucUrl(), ApiNameConfig.danhMuc.apiName, result.fileToken);
      });
  }

  importExcel() {
    this.modalHelper
      .create(
        UploadDanhMucComponent,
        {},
        {
          size: 'xl',
          includeTabs: false,
          modalOptions: {
            nzTitle: 'Thêm dữ liệu danh mục từ excel',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }
}
