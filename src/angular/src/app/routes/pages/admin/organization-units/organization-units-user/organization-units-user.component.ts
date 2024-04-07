import { Component, Injector, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import {
  GetListUserOrganizationunitDto,
  OrganizationunitsServiceProxy,
  PagedRequestOrganizationunitsDto, SysOrganizationunitsDto,
  SysOrganizationunitsUserDto,
} from '@service-proxies/tai-khoan-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { ListUserNotInOrganizationunitModalComponent } from '@app/routes/pages/admin/organization-units/organization-units-user/modal/list-user-not-in-organizationunit-modal.component';
import { OrganizationUnitsServicesService } from '@app/routes/pages/admin/organization-units/organization-units-services.service';

@Component({
  selector: 'app-organization-units-user',
  templateUrl: './organization-units-user.component.html',
  providers: [DestroyRxjsService],
})
export class OrganizationUnitUserComponent extends PagedListingComponentBase<SysOrganizationunitsUserDto> implements OnInit, OnChanges {
  @Input() dataItem: SysOrganizationunitsDto;

  totalCount = 0;
  rfFormGroup: FormGroup;


  constructor(injector: Injector, private _fb: FormBuilder, private _dataService: OrganizationunitsServiceProxy,
              private _organizationUnitsServices: OrganizationUnitsServicesService) {
    super(injector);
    this.rfFormGroup = this._fb.group({
      filter: '',
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.dataItem?.currentValue) {
      this.refresh();
    }
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: PagedRequestOrganizationunitsDto = new PagedRequestOrganizationunitsDto();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    input.organizationunitsId = this.dataItem?.id;
    this._dataService
      .getListNhanVienByPhongBanId(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.totalCount = result.totalCount;
        this.showPaging(result);
      });
  }

  createOrUpdate() {
    this.modalHelper
      .create(
        ListUserNotInOrganizationunitModalComponent,
        { dataItem: this.dataItem },
        {
          size: 'xl',
          includeTabs: false,
          modalOptions: {
            nzTitle: 'Thêm nhân viên',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
          this._organizationUnitsServices.refreshComp();
        }
      });
  }

  deleteMultiple() {
    ora.message.confirm('Bạn có chắc chắn muốn xóa nhân viên đã chọn', 'Xóa nhân viên?', () => {
      ora.ui.setBusy();
      let req = new GetListUserOrganizationunitDto();
      req.arrUsers = this.selectedDataItems;
      req.sysOrganizationunitsId = this.dataItem.id;
      req.abpOrganizationunitsId = this.dataItem.organizationunitsId;
      this._dataService.removeUserFromOrganizationunits(req)
        .pipe(finalize(() => {
          ora.ui.clearBusy();
        }))
        .subscribe(res => {
          if (res.isSuccessful) {
            ora.notify.success('Xóa thành công nhân viên!');
            this.refresh();
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    });
  }
}
