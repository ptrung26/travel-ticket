import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { DanhMucXaServiceProxy, XaDto, ExportXaRequest, PagingXaRequest } from '@service-proxies/danh-muc-service-proxies';

import { SessionKey } from '@sessionKey/*';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditXaComponent } from '@app/routes/pages/danh-muc/xa/create-or-edit.component';
import { UpLoadXaModalComponent } from './up-load-xa-modal/up-load-xa-modal.component';
import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';
import { ModalOptions } from '@node_modules/ng-zorro-antd/modal';
@Component({
  templateUrl: './xa.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class XaComponent extends PagedListingComponentBase<XaDto> implements OnInit {
  rfFormGroup: FormGroup;

  constructor(injector: Injector, private _dataService: DanhMucXaServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.setTitleTab('Danh mục Xã/Phường');
    this.rfFormGroup = this.fb.group({
      filter: '',
      tinhId: [''],
      huyenId: [''],
    });
  }

  clear() {
    this.rfFormGroup.reset();
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingXaRequest = new PagingXaRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.tinhId = formValue.tinhId;
    input.huyenId = formValue.huyenId;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  showCreateOrEditModal(dataItem?: XaDto): void {
    this.modalHelper
      .create(
        CreateOrEditXaComponent,
        { dataItem: dataItem ? dataItem : undefined },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: dataItem ? this.l('Sua_Xa') + dataItem.ten : this.l('Them_Xa'),
          },
        },
      )
      .subscribe((result: XaDto) => {
        if (result) {
          this.refresh();
          sessionStorage.removeItem(SessionKey.danhMucXa + '_' + result.huyenId);
        }
      });
  }

  delete(dataItem: XaDto) {
    const options: ModalOptions = {
      // nzOkText: 'OkText' , có thể thay đổi option tại đay
    };
    ora.message.confirm(
      '',
      this.l('Question_Deleted', { text1: dataItem.ten, text2: 'Xã/Phường' }),
      () => {
        this._dataService.removebyid(dataItem.id).subscribe(() => {
          this.refresh();
          sessionStorage.removeItem(SessionKey.danhMucXa + '_' + dataItem.huyenId);
          ora.notify.success(this.l('DeleteSuccess'));
        });
      },
      () => {},
      options,
    );
  }

  onClickUpload(data: any) {
    this.modalHelper
      .create(
        UpLoadXaModalComponent,
        { dataInput: data },
        {
          size: 1024,
          includeTabs: true,
          modalOptions: {
            nzTitle: 'Import danh mục xã',
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
    const filterInput = new PagingXaRequest();
    const formValue = this.rfFormGroup.value;
    filterInput.filter = formValue.filter;
    filterInput.sorting = this.sorting;
    filterInput.tinhId = formValue.tinhId;
    filterInput.huyenId = formValue.huyenId;

    const input = new ExportXaRequest();
    input.filterInput = filterInput;

    this._dataService
      .exportExcelXa(input)
      .pipe(finalize(() => ora.ui.clearBusy()))
      .subscribe((result) => {
        ora.downloadFile(UrlServices.danhMucUrl(), ApiNameConfig.danhMuc.apiName, result.fileToken);
      });
  }
}
