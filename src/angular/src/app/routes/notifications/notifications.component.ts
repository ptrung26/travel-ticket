import { AfterViewInit, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { PagingSysNotificationsRequest, SysNotificationsDto } from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SysNotificationsServiceProxy } from './../../shared/service-proxies/tai-khoan-service-proxies';

@Component({
  selector: 'app-dashboard',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less'],
})
export class NotificationsComponent extends PagedListingComponentBase<SysNotificationsDto> implements OnInit, OnDestroy, AfterViewInit {
  test = AppConsts.abpEnvironment;
  rfFormGroup: FormGroup;
  totalCount = 0;
  subject: Subject<void> = new Subject<void>();
  showPopup = false;
  popupContent = '';

  constructor(private injector: Injector, private fb: FormBuilder, private _dataService: SysNotificationsServiceProxy) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
      isState: [null],
    });
  }

  ngOnInit(): void {
    this.setTitleTab('Thông báo');
    this.refresh();
  }

  ngAfterViewInit() {
    let boxFilterElement = document.querySelector('.box-filter')
      ? (document.querySelector('.box-filter') as HTMLDivElement)
      : (document.querySelector('ora-layout-filter') as any);
    let headElement = document.querySelector('thead');
    this.scroll.y =
      this.bodyElement.offsetHeight - boxFilterElement.offsetHeight - this.heightNavbarPagging - headElement.clientHeight + 'px';
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.unsubscribe();
  }

  readingNotifi(data: SysNotificationsDto): void {
    ora.ui.setBusy();
    this._dataService
      .statenotification(data?.id)
      .pipe(
        takeUntil(this.subject),
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((response) => {
        if (response.isSuccessful) {
          ora.notify.success('Đã đọc thông báo');
          this.refresh();
        } else {
          ora.notify.error(response.errorMessage);
        }
      });
  }

  deleteNotifi(data: SysNotificationsDto): void {
    ora.ui.setBusy();
    this._dataService
      .deletenotification(data?.id)
      .pipe(
        takeUntil(this.subject),
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((response) => {
        if (response.isSuccessful) {
          ora.notify.success('Xóa thông báo thành công');
          this.refresh();
        } else {
          ora.notify.error(response.errorMessage);
        }
      });
  }

  hidePopup() {
    this.showPopup = false;
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagingSysNotificationsRequest = new PagingSysNotificationsRequest();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.isState = formValue.isState;
    this._dataService
      .getlist(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.totalCount = result.totalCount;
        this.showPaging(result);
      });
  }
}
