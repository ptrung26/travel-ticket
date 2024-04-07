import { Component, Injector, OnInit } from '@angular/core';
import {
  OrganizationunitsServiceProxy,
  PagedRequestOrganizationunitsDto, SysOrganizationunitsDto,
} from '@app/shared/service-proxies/tai-khoan-service-proxies';
import { finalize } from 'rxjs/operators';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { CreateOrUpdateOrganizationUnitsModalComponent } from './modal/create-or-update-modal.component';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import { OrganizationUnitsServicesService } from '@app/routes/pages/admin/organization-units/organization-units-services.service';

@Component({
  selector: 'app-organization-units',
  templateUrl: './organization-units.component.html',
  styleUrls: ['./organization-units.component.scss'],
  providers: [DestroyRxjsService],
})
export class OrganizationUnitsComponent extends AppComponentBase implements OnInit {
  listData: SysOrganizationunitsDto[] = [];
  dataItem: SysOrganizationunitsDto;

  constructor(
    injector: Injector,
    private _organizationunitsServiceProxy: OrganizationunitsServiceProxy,
    private _organizationUnitsServices: OrganizationUnitsServicesService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getListOrganizationunits();
    this._organizationUnitsServices.$refresh.subscribe(res => {
      this.getListOrganizationunits();
    });
  }

  getListOrganizationunits() {
    ora.ui.setBusy();
    this._organizationunitsServiceProxy
      .getdatalistorganizationunits(new PagedRequestOrganizationunitsDto())
      .pipe(finalize(() => {
        ora.ui.clearBusy();
      }))
      .subscribe(res => {
        this.listData = res.items;
      });
  }

  selectedSubmenu(event: any, menu: SysOrganizationunitsDto) {
    const elementRemove = document.querySelector('.active-menu-custom');
    elementRemove?.classList.remove('active-menu-custom');

    const elementMenuItem = document.querySelector('.ant-menu-item-selected');
    elementMenuItem?.classList.remove('ant-menu-item-selected');

    const element = event.target as HTMLDivElement;
    element.parentElement.classList.add('active-menu-custom');

    this.dataItem = menu;
  }

  selectedMenuItem(menu: SysOrganizationunitsDto) {
    const elementRemove = document.querySelector('.active-menu-custom');
    elementRemove?.classList.remove('active-menu-custom');

    this.dataItem = menu;
  }

  delete(menu: SysOrganizationunitsDto) {
    ora.message.confirm('Bạn có chắc chắn muốn xóa phòng ban: ' + menu.tenPhongBan, 'Xóa phòng ban?', () => {
      ora.ui.setBusy();
      this._organizationunitsServiceProxy
        .xoaPhongBan(menu.id)
        .pipe(finalize(() => {
          ora.ui.clearBusy();
        }))
        .subscribe((res) => {
          if (res.isSuccessful) {
            ora.notify.success('Xóa thành công phòng ban: ' + menu.tenPhongBan);
            this.getListOrganizationunits();
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    });
  }

  createOrUpdate(menu?: SysOrganizationunitsDto) {
    this.modalHelper.create(
      CreateOrUpdateOrganizationUnitsModalComponent,
      {
        dataItem: menu,
      },
      {
        size: 'md',
        includeTabs: false,
        modalOptions: {
          nzTitle: menu?.id ? 'Sửa phòng ban: ' + menu.tenPhongBan : 'Thêm phòng ban',
        },
      },
    ).subscribe((result) => {
      if (result) {
        this.getListOrganizationunits();
      }
    });
  }
}
