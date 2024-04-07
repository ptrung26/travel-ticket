import { ChangeDetectorRef, Injectable, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { CodeSystemDto, CodeSystemServiceProxy, PagingCodeSystemRequests } from '@app/shared/service-proxies/danh-muc-service-proxies';

@Injectable({
  providedIn: 'root',
})
export class HeMayModalService extends PagedListingComponentBase<CodeSystemDto> {
  isVisible = false;
  isConfirmLoading = false;
  rfFormGroup: FormGroup;
  cdr: ChangeDetectorRef;

  constructor(injector: Injector, private fb: FormBuilder, private _dataService: CodeSystemServiceProxy) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
      parentCode: ['thietBi'],
      filterThietBiDaCo: '',
    });
  }

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  save() {
    this.isConfirmLoading = true;
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
        this.cdr.markForCheck();
      });
  }
}
