import { Component, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { PagingListTourSanPhamRequest, TourSanPhamDto, TourSanPhamServiceProxy } from '@app/shared/service-proxies/san-pham-service-proxies';
import { FormBuilder } from '@ngneat/reactive-forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import { ThongTinMoBanModalComponent } from './thong-tin-mo-ban-modal/thong-tin-mo-ban-modal.component';
import { ThanhTienKhoangNguoi } from './chiet-tinh-tour/chiet-tinh-xe/chiet-tinh-xe.component';

@Component({
  selector: 'danh-sach-tour-san-pham',
  templateUrl: './tour-san-pham.component.html',
})
export class TourSanPhamComponent extends PagedListingComponentBase<any> {
  viewShow: 'list' | 'create-or-update' | 'cau-hinh-chiet-tinh' = 'list';
  rfForm: FormGroup;
  data: TourSanPhamDto;
  confirmModal?: NzModalRef;
  constructor(injector: Injector, private fb: FormBuilder, private _dataService: TourSanPhamServiceProxy, private modal: NzModalService) {
    super(injector);
    this.rfForm = this.fb.group({
      filter: '',
    })
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input = new PagingListTourSanPhamRequest();
    const formValue = this.rfForm.value;
    input.filter = formValue.filter;
    input.skipCount = this.skipCount;
    input.sorting = this.sorting;
    input.maxResultCount = request.maxResultCount;

    this._dataService
      .getlist(input)
      .pipe(
        finalize(() => {
        }),
      )
      .subscribe((res) => {
        this.isTableLoading = false;
        this.dataList = res.items;
        this.totalItems = res.totalCount;
      });
  }

  getTongTien1Nguoi(data: TourSanPhamDto): number {
    if (!data || !data.thanhTienKhoangNguoiJson) {
      return 0;
    }

    const thanhTien: ThanhTienKhoangNguoi[] = JSON.parse(data.thanhTienKhoangNguoiJson) as ThanhTienKhoangNguoi[];
    const khoangNguoi1 = thanhTien?.find(x => x.khoangNguoiCode == "1Nguoi");
    if (khoangNguoi1) {
      return khoangNguoi1.thanhTien;
    }

    return 0;
  }

  showCreateOrUpdate(data?: TourSanPhamDto) {
    this.data = data;
    this.viewShow = "create-or-update";
  }

  cauHinhChietTinh(data?: TourSanPhamDto) {
    this.viewShow = "cau-hinh-chiet-tinh";
    this.data = data;
  }

  huyTour(data: TourSanPhamDto) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Huỷ Tour du lịch',
      nzContent: 'Bạn có chắc chắn muốn huỷ Tour du lịch này không ?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          ora.ui.setBusy();
          this._dataService.huytoursanpham(data.id).subscribe(res => {
            ora.ui.clearBusy();
            if (res.isSuccessful) {
              ora.notify.success("Huỷ Tour thành công!");
            } else {
              ora.notify.error("Có lỗi xảy ra, vui lòng thử lại sau");
            }
          })
        }).catch(() => console.log('Lỗi huỷ tour!'))
    });

  }

  capNhapMoBan(data: TourSanPhamDto) {
    this.modalHelper.create(ThongTinMoBanModalComponent, {
      dataItem: data
    }, {
      size: 'md',
      includeTabs: false,
      modalOptions: {
        nzTitle: "Cập nhật thông tin mở bán Tour"
      },
    }).subscribe(res => {
      if (res.isSuccessful) {
        ora.notify.success("Cập nhập thông tin mở bán thành công!");
      }
      this.refresh();

    })
  }

  close() {
    this.viewShow = 'list';
    this.refresh();
  }

}
