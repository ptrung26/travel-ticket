import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { NguoiLienHeNCCDto, NguoiLienHeServiceProxy, PagingListNguoiLienHeRequest } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateNguoiLienHeComponent } from './create-or-update-nguoi-lien-he.component';

@Component({
  selector: 'nguoi-lien-he-ncc',
  templateUrl: './nguoi-line-he-ncc.component.html',
  styles: [
    `
      .m-label {
        display: flex;
        align-items: center;
      }
    `
  ]
})
export class NguoiLienHeNCCComponent extends PagedListingComponentBase<any> implements OnChanges {

  rfForm: FormGroup;
  @Input() nhaCungCapId: number;
  @Input() nhaCungCapCode?: string;

  constructor(injector: Injector, private fb: FormBuilder, private _dataService: NguoiLienHeServiceProxy) {
    super(injector);
    this.rfForm = this.fb.group({
      filter: "",
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, this.nhaCungCapId);
    if (this.nhaCungCapId > 0) {
      this.refresh();
    }
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input = new PagingListNguoiLienHeRequest();
    const formValue = this.rfForm.value;
    input.filter = formValue.filter;
    input.skipCount = this.skipCount;
    input.sorting = this.sorting;
    input.maxResultCount = request.maxResultCount;
    input.nhaCungCapId = this.nhaCungCapId;
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

  showCreateOrUpdate(dataItem?: NguoiLienHeNCCDto) {
    this.modalHelper.create(
      CreateOrUpdateNguoiLienHeComponent,
      {
        dataItem: dataItem,
        nhaCungCapId: this.nhaCungCapId,
        nhaCungCapCode: this.nhaCungCapCode,
      },
      {
        size: 'md',
        includeTabs: false,
        modalOptions: {
          nzTitle: dataItem?.id > 0 ? "Chỉnh sửa thông tin người liên hệ" : "Thêm mới thông tin người liên hệ"
        },
      },
    ).subscribe((result) => {
      if (result) {
        let message = dataItem?.id > 0 ? "Chỉnh sửa thông tin thành công!" : "Thêm mới thành công!";
        ora.notify.success(message);
        this.refresh();
      }
    });
  }



}
