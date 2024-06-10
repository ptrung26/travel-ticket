import { Component, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { NhaCungCapKhachSanDto, NhaCungCapKhachSanDtoPagedResultDto, NhaCungCapKhachSanServiceProxy, PagingListNhaCungCapKhachSanRequest } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'nha-cung-cap-khach-san',
  templateUrl: './nha-cung-cap-khach-san.component.html',
})
export class NhaCungCapKhachSanComponent extends PagedListingComponentBase<any> {
  rfForm: FormGroup;
  viewShow: 'list' | 'create-or-update' = 'list';
  dataItem: NhaCungCapKhachSanDto;

  constructor(private injector: Injector, private fb: FormBuilder, private _dataService: NhaCungCapKhachSanServiceProxy) {
    super(injector);
    this.rfForm = this.fb.group({
      filter: [''],
      soSao: [null],
    });
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    var input = new PagingListNhaCungCapKhachSanRequest();
    const formValue = this.rfForm.value;
    input.filter = formValue.filter;
    input.soSao = formValue.soSao;
    input.skipCount = this.skipCount;
    input.sorting = this.sorting;
    input.maxResultCount = this.pageNumber;

    ora.ui.setBusy();
    this._dataService
      .paginglist(input)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        this.isTableLoading = false;
        this.dataList = res.items;
        this.totalItems = res.totalCount;
      });
  }

  showCreateOrUpdate(data?: NhaCungCapKhachSanDto) {
    this.viewShow = 'create-or-update';
    this.dataItem = data;
  }

  close() {
    this.viewShow = 'list';
  }
}
