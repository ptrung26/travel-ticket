import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, tap } from '@node_modules/rxjs/operators';
import { SessionKey } from '@sessionKey/*';
import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';
import {
  DanhMucQuocTichServiceProxy,
  QuocTichDto,
  PagingQuocTichRequest,
  ExportQuocTichRequest,
} from '@service-proxies/danh-muc-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalOptions } from '@node_modules/ng-zorro-antd/modal';
import { CreateOrEditQuocTichComponent } from './create-or-edit.component';
import { UpLoadQuocTichModalComponent } from './up-load-quoc-tich-modal/up-load-modal.component';
@Component({
  templateUrl: './quoc-tich.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class QuocTichComponent extends PagedListingComponentBase<QuocTichDto> implements OnInit {
  rfFormGroup: FormGroup;

  constructor(injector: Injector, private _dataService: DanhMucQuocTichServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
    });
  }
  ngOnInit(): void {
    this.refresh();
  }
  clear() {
    this.rfFormGroup.reset();
    this.refresh();
  }
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingQuocTichRequest = new PagingQuocTichRequest();
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
  onClickSua(dataItem?: QuocTichDto) {
    this.modalHelper
      .create(
        CreateOrEditQuocTichComponent,
        { dataItem: dataItem },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: dataItem ? this.l('Sua_QuocTich') + dataItem.ten : this.l('Them_QuocTich'),
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  delete(dataItem: QuocTichDto) {
    const options: ModalOptions = {
      // nzOkText: 'OkText' , có thể thay đổi option tại đay
    };
    ora.message.confirm(
      '',
      this.l('Question_Deleted', { text1: dataItem.ten, text2: 'quốc gia' }),
      () => {
        this._dataService.removebyid(dataItem.id).subscribe(() => {
          this.refresh();
          ora.notify.success('Xóa dữ liệu thành công!');
        });
      },
      () => {},
      options,
    );
  }
  exportExcel() {
    const filterInput = new PagingQuocTichRequest();
    const formValue = this.rfFormGroup.value;
    filterInput.filter = formValue.filter;
    filterInput.sorting = this.sorting;
    const input = new ExportQuocTichRequest();
    input.filterInput = filterInput;
    // ora.ui.setBusy('chotomate');
    this._dataService
      .exportExcelQuocTich(input)
      .pipe(finalize(() => ora.ui.clearBusy()))
      .subscribe((result) => {
        ora.downloadFile(UrlServices.danhMucUrl(), ApiNameConfig.danhMuc.apiName, result.fileToken);
      });
  }

  onClickUpload(data: any) {
    this.modalHelper
      .create(
        UpLoadQuocTichModalComponent,
        { dataInput: data },
        {
          size: 1024,
          includeTabs: true,
          modalOptions: {
            nzTitle: 'Import danh mục quốc tịch',
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
