import { Component, OnInit, Injector, ViewEncapsulation, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import {
  GetListUserOrganizationunitDto,
  OrganizationunitsServiceProxy, PagedRequestOrganizationunitsDto, SysOrganizationunitsDto,
  SysOrganizationunitsUserDto,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { ModalPagedListingComponentBase } from '@shared/common/modal-paged-listing-component-base';
import { PagedRequestDto } from '@app/shared/common/paged-listing-component-base';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';

@Component({
  selector: 'app-list-user-not-in-organizationunit-modal',
  templateUrl: './list-user-not-in-organizationunit-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyRxjsService],
})
export class ListUserNotInOrganizationunitModalComponent extends ModalPagedListingComponentBase<SysOrganizationunitsUserDto> implements OnInit {
  @Input() dataItem: SysOrganizationunitsDto;

  totalCount = 0;
  rfFormGroup: FormGroup;

  constructor(injector: Injector, private _fb: FormBuilder, private _dataService: OrganizationunitsServiceProxy) {
    super(injector);
    this.rfFormGroup = this._fb.group({
      filter: '',
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected getDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagedRequestOrganizationunitsDto = new PagedRequestOrganizationunitsDto();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.organizationunitsId = this.dataItem?.id;
    this._dataService
      .getListNhanVienNotInOrgan(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.totalCount = result.totalCount;
        this.showPaging(result);
      });
  }

  save() {
    if (!this.selectedDataItems.length) {
      ora.notify.error('Bạn cần tích chọn nhân viên');
      return;
    }
    ora.ui.setBusy();
    let input = new GetListUserOrganizationunitDto();
    input.arrUsers = this.selectedDataItems;
    input.sysOrganizationunitsId = this.dataItem.id;
    input.abpOrganizationunitsId = this.dataItem.organizationunitsId;
    this._dataService.addUserToOrganizationunits(input)
      .pipe(finalize(() => {
        ora.ui.clearBusy();
      }))
      .subscribe((response) => {
        if (response.isSuccessful) {
          ora.notify.success('Thêm thành viên thành công');
          this.success(true);
        } else {
          ora.notify.error(response.errorMessage);
        }
      });
  }
}
