import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from '@node_modules/rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { CreateOrEditCauHinhChungComponent } from './create-or-edit.component';
import { ConfigSystemDto, ConfigSystemServiceProxy, PagingConfigSystemRequest } from '@app/shared/service-proxies/danh-muc-service-proxies';

@Component({
  templateUrl: './cau-hinh-chung.component.html',
  styleUrls: ['./cau-hinh-chung.component.scss'],
})
export class CauHinhChungComponent extends PagedListingComponentBase<ConfigSystemDto> implements OnInit {
  rfFormGroup: FormGroup;

  constructor(injector: Injector, private _dataService: ConfigSystemServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingConfigSystemRequest = new PagingConfigSystemRequest();
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

  showCreateOrEditModal(dataItem?: ConfigSystemDto): void {
    this.modalHelper
      .create(
        CreateOrEditCauHinhChungComponent,
        { dataItem: dataItem },
        {
          size: 'lg',
          includeTabs: false,
          modalOptions: {
            nzTitle: dataItem ? 'Sửa thông tin cấu hình: ' + dataItem.ma : 'Thêm mới cấu hình',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  delete(dataItem: ConfigSystemDto) {
    ora.message.confirm(
      '',
      this.l('Bạn có muốn xóa cấu hình: ', dataItem.ma),
      () => {
        this._dataService.removebyid(dataItem.id).subscribe(() => {
          this.refresh();
          ora.notify.success(this.l('DeleteSuccess'));
        });
      },
      () => {},
    );
  }
}
