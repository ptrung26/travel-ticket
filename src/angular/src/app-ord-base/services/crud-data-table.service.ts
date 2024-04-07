import { Injectable } from '@angular/core';
import { AppUtilityService } from './app-utility.service';
import { OrdCreateOrUpdateModalComponent } from '../pages-custom/ord-create-or-update-modal/ord-create-or-update-modal.component';
import { OrdFormItem } from '../ord-form/dynamic-form/dynamic-form-page.component';
//import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { RestService } from '@abp/ng.core';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import { CommonComboDataStateService } from '@app/routes/states/common-combo-data-state.service';

@Injectable({
  providedIn: 'root',
})
export class CrudDataTableService {
  apiName = '';

  constructor(
    private modalService: NzModalService,
    private restService: RestService,
    private comboState: CommonComboDataStateService
  ) { }

  openModal(option: {
    id: string;
    title: string;
    urlApi: string;
    apiName: string;
    listOfFormItems: OrdFormItem[];
    callBack: any;
    width?: number;
    beforeSaving?: any;
    initDataCreate?: any;
    isViewDetail?: boolean;
    hasPermission?: boolean;
    onModalCloseEvent?: any;
    urlUploadFile?: string;
    isDisableEditMode?: boolean;
  }) {
    let title = AppUtilityService.isNullOrEmpty(option.id) ? 'Thêm mới' : 'Sửa thông tin';
    let listOfFormItems = _.cloneDeep(option.listOfFormItems);
    if (option.isViewDetail && option.isViewDetail === true) {
      title = 'Thông tin chi tiết';
      listOfFormItems = _.map(listOfFormItems, (it) => {
        it.disabled = true;
        return it;
      });
    }
    const modal = this.modalService.create({
      nzTitle: (title + ' ' + option.title).toUpperCase(),
      nzWidth: (option.width ? option.width : 600) + 'px',
      nzContent: OrdCreateOrUpdateModalComponent,
      nzComponentParams: {
        baseUrlApi: option.urlApi,
        id: option.id,
        listOfFormItems,
        apiName: option.apiName,
        beforeSaving: option.beforeSaving,
        initDataCreate: option.initDataCreate,
        isViewDetail: option.isViewDetail,
        hasPermission: option.hasPermission,
        urlUploadFile: option.urlUploadFile,
        isDisableEditMode: option.isDisableEditMode,
      },
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
    });

    modal.afterClose.subscribe((result) => {
      if (option.onModalCloseEvent) {
        option.onModalCloseEvent();
      }
      if (result) {
        this.clearSessionStorageIfDanhMucService(option.urlApi);
        option.callBack(result);
      }
    });
  }

  delete(option: { message: string; id: string; deleteUrl: string; deleteApiName?: string; callBack: any }) {
    this.modalService.confirm({
      nzWidth: 600,
      nzTitle: `XÁC NHẬN TRƯỚC KHI XÓA`,
      nzClosable: true,
      nzContent: `Bạn có chắc xóa thông tin ${option.message} này không?`,
      nzOnOk: () => {
        ora.ui.setBusy();
        this.restService
          .request<void, void>(
            {
              method: 'POST',
              url: `/api/${option.deleteUrl}/removebyid/${option.id}`,
            },
            { apiName: option.deleteApiName ?? this.apiName }
          )
          .pipe(
            finalize(() => {
              ora.ui.clearBusy();
            })
          )
          .subscribe((d) => {
            const mess = `Xóa thành công thông tin ${option.message}`;
            ora.notify.info(mess);
            this.clearSessionStorageIfDanhMucService(option.deleteUrl);
            option.callBack(true);
          });
      },
      nzOkText: 'Có',
      nzCancelText: 'Không',
    });
  }

  clearSessionStorageIfDanhMucService(url: string) {
    if (!AppUtilityService.isNullOrEmpty(url)) {
      if (url.toLowerCase().indexOf('danh-muc') > -1) {
        sessionStorage.clear();
        this.comboState.clearAll();
      }
    }
  }
}
