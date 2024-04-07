import { AfterContentInit, Component, HostListener, Injector, Input, ViewChild } from '@angular/core';
import { DynamicFormPageComponent, OrdFormItem } from '../../ord-form/dynamic-form/dynamic-form-page.component';
import { RestService } from '@abp/ng.core';
import { AppUtilityService } from '../../services/app-utility.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: './ord-create-or-update-modal.component.html',
})
export class OrdCreateOrUpdateModalComponent implements AfterContentInit {
  @Input() baseUrlApi = '';
  @Input() listOfFormItems: OrdFormItem[] = [];
  @Input() id: string;
  dataItem: any = {};
  @ViewChild('createUpdateForm') createUpdateForm: DynamicFormPageComponent;
  @Input() apiName = '';
  @Input() beforeSaving: any;
  @Input() initDataCreate: any = null;
  @Input() isViewDetail = false;
  @Input() hasPermission: any;
  @Input() isDisableEditMode = false;
  urlUploadFile: string;
  isSaveSuccess = false;
  isLoadingBtn = false;
  isContinue = false;

  get viewMode() {
    if (this.isViewDetail === true) {
      return 'xem';
    }
    if (AppUtilityService.isNullOrEmpty(this.id)) {
      return 'them';
    }
    return 'sua';
  }

  constructor(injector: Injector, private modal: NzModalRef, private restService: RestService) { }

  ngAfterContentInit(): void {
    if (!AppUtilityService.isNullOrEmpty(this.id)) {
      this.getById();
    } else {
      if (!AppUtilityService.isNullOrEmpty(this.initDataCreate)) {
        setTimeout(() => {
          this.dataItem = _.cloneDeep(this.initDataCreate);
        });
      }
    }
  }

  getById() {
    ora.ui.setBusy();
    const url = `/api/${this.baseUrlApi}/getbyid/${this.id}`;
    this.restService
      .request<void, any>(
        {
          method: 'GET',
          url,
        },
        { apiName: this.apiName }
      )
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        })
      )
      .subscribe((d) => {
        this.dataItem = d;
        //AppUtilityService.convertIntToStringPropertyOfObject(this.dataItem);
      });
  }

  save(isContinue = false) {
    isContinue = this.isContinue;
    const data = this.createUpdateForm.getDataForm();
    if (data === null) {
      ora.notify.error('Vui lòng điền đầy đủ thông tin', 'Lỗi');
      return;
    }
    if (this.isLoadingBtn) {
      return false;
    }
    this.isLoadingBtn = true;
    const req = {
      ...data,
    };
    if (AppUtilityService.isNullOrEmpty(this.beforeSaving) === false) {
      this.beforeSaving(req);
    }
    ora.ui.setBusy();
    if (!AppUtilityService.isNullOrEmpty(this.id)) {
      this.update(req, this.id)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
            this.isLoadingBtn = false;
          })
        )
        .subscribe((dataResult) => {
          this.onSaveSuccess(dataResult, isContinue);
        });
    } else {
      this.create(req)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
            this.isLoadingBtn = false;
          })
        )
        .subscribe((dataResult) => {
          this.onSaveSuccess(dataResult, isContinue);
        });
    }
  }

  create(createInput: any): Observable<any> {
    return this.restService.request<any, any>(
      {
        method: 'POST',
        url: `/api/${this.baseUrlApi}/create`,
        body: createInput,
      },
      { apiName: this.apiName }
    );
  }

  update(createInput: any, id: string): Observable<any> {
    return this.restService.request<any, any>(
      {
        method: 'POST',
        url: `/api/${this.baseUrlApi}/update/${id}`,
        body: createInput,
      },
      { apiName: this.apiName }
    );
  }

  onSaveSuccess(data, isContinue: boolean) {
    // response trả ra kiểu CommonResultDto
    if (data && data?.isSuccessful === false && !AppUtilityService.isNullOrEmpty(data?.errorMessage)) {
      ora.notify.error(data.errorMessage, 'Lỗi');
      return false;
    }
    if (data && data.isExists === true) {
      if (!AppUtilityService.isNullOrEmpty(data.noiTuVong)) {
        ora.notify.error(`Trường hợp tử vong đã tồn tại`, 'Lỗi');
        return false;
      }
      if (data.loaiBaoCao == 1) {
        ora.notify.error(`Báo cáo đã tồn tại`, 'Lỗi');
        return false;
      }
      ora.notify.error(`Mã "${AppUtilityService.isNullOrEmpty(data.code) ? data.ma : data.code}" đã tồn tại`, 'Lỗi');
      return false;
    } else if (data && data.isTaiSanGiamExists === true) {
      ora.notify.error(`Tài sản bạn chọn đã được khai giảm`, 'Lỗi');
      return false;
    } else if (data && data.isBaoCaoTuanExists === true) {
      ora.notify.error('Lỗi tạo báo cáo tuần: Đã tồn tại báo tuần ' + data.tuan + ' tháng ' + data.thang + '  năm ' + data.nam + '  rồi', 'Lỗi');
      return false;
    } else if (data && data.isExistMa === true) {
      ora.notify.error('Mã ' + data.ma + ' đã tồn tại!', 'Lỗi');
      return false;
    } else {
      this.isSaveSuccess = true;
      ora.notify.info('Lưu dữ liệu thành công', 'Thành công');
      if (isContinue === false) {
        this.close(true);
        return false;
      }
      this.clearFormInsertContinue();
    }
  }

  close(isSave?: boolean): void {
    if (this.isSaveSuccess === true) {
      isSave = true;
    }
    this.modal.destroy(isSave);
  }

  chuyenCheDoSua() {
    this.isViewDetail = false;
    this.listOfFormItems.forEach((it) => {
      it.disabled = false;
    });
  }

  // hot key
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // F11
    if (event.keyCode === 122) {
      this.save();
      return false;
    }
    // f10
    if (event.keyCode === 121) {
      this.save(true);
      return false;
    }
  }

  clearFormInsertContinue() {
    this.id = null;
    this.dataItem = _.cloneDeep(this.initDataCreate || {});
    this.createUpdateForm.submitted = false;
  }
}
