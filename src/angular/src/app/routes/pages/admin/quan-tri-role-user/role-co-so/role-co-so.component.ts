import {
  Component, Injector,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  ModalOptions,
  NzModalService,
} from '@node_modules/ng-zorro-antd/modal';

import {
  finalize,
} from 'rxjs/operators';
import {
  RoleCoSoPagedInputDto,
  SysRoleDto,
  SysRoleServiceProxy,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { UpsertRoleCoSoComponent } from './upsert-role-co-so/upsert-role-co-so.component';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { PermissionTreeComponent } from '@app/routes/pages/admin/quan-tri-role-user/role-co-so/permission-tree/permission-tree.component';

@Component({
  selector: 'app-role-co-so',
  templateUrl: './role-co-so.component.html',
  styleUrls: ['./role-co-so.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RoleCoSoComponent extends PagedListingComponentBase<SysRoleDto> implements OnInit {
  @ViewChild(PermissionTreeComponent) permissionTreeComp: PermissionTreeComponent;
  rfFormGroup: FormGroup;
  dataItem: SysRoleDto;
  totalCount = 0;

  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    private _modal: NzModalService,
    private _modalService: NzModalService,
    private _dataService: SysRoleServiceProxy) {
    super(injector);
    this.rfFormGroup = this._fb.group({
      filter: '',
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    const input: RoleCoSoPagedInputDto = new RoleCoSoPagedInputDto();
    input.maxResultCount = request.maxResultCount;
    input.skipCount = request.skipCount;
    input.sorting = request.sorting;
    const formValue = this.rfFormGroup.value;
    input.filter = formValue.filter;
    this._dataService
      .getListRoleCoSo(input)
      .pipe(finalize(finishedCallback))
      .subscribe((result) => {
        this.dataList = result.items;
        this.totalCount = result.totalCount;
        this.showPaging(result);
      });
  }

  createOrUpdate(data?: SysRoleDto) {
    this.modalHelper
      .create(
        UpsertRoleCoSoComponent,
        { dataItem: data },
        {
          size: 'md',
          includeTabs: false,
          modalOptions: {
            nzTitle: data ? 'Sửa vai trò' : 'Thêm vai trò',
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  delete(data: SysRoleDto) {
    ora.message.confirm(`Bạn có chắc chắn muốn xóa vai trò: ${data.ten}`, 'Xóa vai trò', () => {
      ora.ui.setBusy();
      this._dataService
        .xoaRoleCoSo(data.id)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((res) => {
          if (res.isSuccessful) {
            ora.notify.success(`Xóa vai trò ${data.ten} thành công!`);
            this.refresh();
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    });
  }

  selectRow(data: SysRoleDto) {
    this.dataItem = data;
  }

  save() {
    const result = this.permissionTreeComp.save();
    if (result) {
      this.dataItem = this.dataItem;
    }
  }
}
