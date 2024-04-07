import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import {
  CommonServiceProxy,
  ExportExcelNhaCungCapRequest,
  NhaCungCapDto,
  NhaCungCapServiceProxy,
  PagingNhaCungCapRequest,
} from '@app/shared/service-proxies/danh-muc-service-proxies';
import { ApiNameConfig, UrlServices } from '@app/shared/service-proxies/service-url-config/url-services';
import { FormBuilder } from '@ngneat/reactive-forms';
import { finalize } from 'rxjs/operators';
import { CreateOrEditNhaCungCapComponent } from './create-or-edit-nha-cung-cap/create-or-edit-nha-cung-cap.component';

@Component({
  selector: 'nha-cung-cap',
  templateUrl: './nha-cung-cap.component.html',
})
export class NhaCungCapComponent extends PagedListingComponentBase<any> implements OnInit {
  rfFormGroup: FormGroup;
  listPhanLoaiNhaCungCap = [];

  text: '';
  constructor(
    injector: Injector,
    private _dataService: NhaCungCapServiceProxy,
    private _commonService: CommonServiceProxy,
    private fb: FormBuilder,
  ) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: [''],
      trangThai: [],
      listPhanLoai: [],
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingNhaCungCapRequest = new PagingNhaCungCapRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.trangThai = formValue.trangThai;
    input.listPhanLoai = formValue.listPhanLoai;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((rs) => {
        this.dataList = rs.items;
        this.showPaging(rs);
      });
  }

  showCreateOrEditModal(dataItem?: NhaCungCapDto) {
    this.modalHelper
      .create(
        CreateOrEditNhaCungCapComponent,
        { dataItem: dataItem },
        {
          size: 'lg',
          includeTabs: false,
          modalOptions: {
            nzTitle: dataItem ? 'Sửa thông tin nhà phân phối: ' + dataItem.ten : 'Thêm mới nhà phân phối',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  delete(data: NhaCungCapDto): void {
    ora.message.confirm('Bạn có muốn xóa: ' + data.ten, 'Xóa nhà phân phối', () => {
      ora.ui.setBusy();
      this._dataService
        .delete(data.id)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((result) => {
          if (result.isSuccessful) {
            this.refresh();
            ora.notify.success('Xoá thành công nhà phân phối ' + data.ten);
          } else {
            ora.notify.error(result.errorMessage);
          }
        });
    });
  }

  exportExcel() {
    ora.ui.setBusy();
    const filterInput = new PagingNhaCungCapRequest();
    const formValue = this.rfFormGroup.value;
    filterInput.filter = formValue.filter;
    filterInput.trangThai = formValue.trangThai;
    const input = new ExportExcelNhaCungCapRequest();
    input.filterInput = filterInput;
    this._dataService
      .exportNhaCungCap(input)
      .pipe(finalize(() => ora.ui.clearBusy()))
      .subscribe((result) => {
        ora.ui.clearBusy();
        ora.downloadFile(UrlServices.danhMucUrl(), ApiNameConfig.danhMuc.apiName, result.fileToken);
      });
  }
}
