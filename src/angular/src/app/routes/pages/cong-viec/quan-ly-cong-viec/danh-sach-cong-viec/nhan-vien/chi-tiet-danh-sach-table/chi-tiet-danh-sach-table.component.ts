import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import {
  CongViecDto,
  DanhSachCongViecServiceProxy,
  LEVEL_CONG_VIEC,
  MUC_DO_CONG_VIEC,
  TRANG_THAI_CONG_VIEC,
  PagingCongViecRequest,
} from '@service-proxies/cong-viec-service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { CreateOrEditCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/create-or-update-cong-viec/create-or-edit-cong-viec.component';

@Component({
  selector: 'chi-tiet-danh-sach-table',
  templateUrl: './chi-tiet-danh-sach-table.component.html',
  styleUrls: ['./chi-tiet-danh-sach-table.component.scss'],
})
export class ChiTietDanhSachTableComponent extends PagedListingComponentBase<CongViecDto> implements OnInit {
  @Input() permission: any;
  @Input() duAn: CongViecDto;
  @Output() backListEvent = new EventEmitter<void>();

  rfFormGroup: FormGroup;
  MUC_DO_CONG_VIEC = MUC_DO_CONG_VIEC;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;

  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    private _dataService: DanhSachCongViecServiceProxy) {
    super(injector);
    this.rfFormGroup = this._fb.group({
      filter: '',
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingCongViecRequest = new PagingCongViecRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.level = LEVEL_CONG_VIEC.CONG_VIEC;
    input.isGetMyJob = true;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  createOrUpdate(data: CongViecDto) {
    this.modalHelper.create(
      CreateOrEditCongViecComponent,
      {
        congViec: data,
        duAnId: this.duAn.id,
        permission: this.permission,
      },
      {
        size: 1300,
        includeTabs: false,
        modalOptions: {
          nzTitle: 'Chi tiết công việc',
        },
      },
    ).subscribe((result) => {
      this.refresh();
    });
  }

  close() {
    this.backListEvent.emit();
  }

}
