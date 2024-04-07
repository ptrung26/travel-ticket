import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { finalize } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { RestService } from '@abp/ng.core';
import { DynamicFormPageComponent, OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { KEY_CODE } from '@app/shared/key-code';

export interface IUpsertPageRef {
  id: string | null;
  title: string;
  baseUrlApi: string;
  apiName: string;
  listOfFormItems: OrdFormItem[];
  initDataCreate: any;
  isViewDetail: boolean;
  beforeSaving: any;
}

@Component({
  selector: 'app-ord-upsert-page',
  templateUrl: './ord-upsert-page.component.html',
  styleUrls: ['./ord-upsert-page.component.scss']
})
export class OrdUpsertPageComponent implements OnInit {
  @Input() pageConfig: IUpsertPageRef;
  @Output() closeEvent = new EventEmitter();
  title = '';
  baseUrlApi = '';
  apiName = '';
  listOfFormItems: OrdFormItem[] = [];
  id: string;
  initDataCreate: any = null;
  isViewDetail = false;
  beforeSaving: any;
  dataItem: any = {};
  urlUploadFile = '';
  @ViewChild('createUpdateForm') createUpdateForm: DynamicFormPageComponent;
  isSaveSuccess = false;
  isShow = false;
  tiepTucThem: any;
  timeStamp = 0;

  get viewMode() {
    if (this.isViewDetail === true) {
      return 'xem';
    }
    if (AppUtilityService.isNullOrEmpty(this.id)) {
      return 'them';
    }
    return 'sua';
  }

  constructor(private restService: RestService) {
  }

  ngOnInit(): void {
    this.timeStamp = Number(new Date());
    if (this.pageConfig) {
      const config = _.cloneDeep(this.pageConfig);
      setTimeout(() => {
        this.id = config.id;
        this.title = config.title;
        this.baseUrlApi = config.baseUrlApi;
        this.apiName = config.apiName;
        this.listOfFormItems = config.listOfFormItems;
        this.initDataCreate = config.initDataCreate;
        this.isViewDetail = config.isViewDetail;
        this.beforeSaving = config.beforeSaving;
        if (config.isViewDetail === true) {
          this.listOfFormItems.forEach((it) => {
            it.disabled = true;
          });
        }
        this.show();
      });
    }
  }

  get idJquery() {
    return 'app-ord-upsert-page-' + this.timeStamp;
  }

  show() {
    this.isShow = true;
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
          url
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
        AppUtilityService.convertIntToStringPropertyOfObject(this.dataItem);
      });
  }

  save(isContinue = false) {
    const data = this.createUpdateForm.getDataForm();
    if (data === null) {
      ora.notify.error('Vui lòng điền đầy đủ thông tin', 'Lỗi');
      return;
    }

    const req = {
      ...data
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
        body: createInput
      },
      { apiName: this.apiName }
    );
  }

  update(createInput: any, id: string): Observable<any> {
    return this.restService.request<any, any>(
      {
        method: 'POST',
        url: `/api/${this.baseUrlApi}/update/${id}`,
        body: createInput
      },
      { apiName: this.apiName }
    );
  }

  onSaveSuccess(data, isContinue: boolean) {
    if (data?.id === -1) {
      ora.notify.error(`Mã "${AppUtilityService.isNullOrEmpty(data.code) ? data.ma : data.code}" đã được sử dụng`, 'Trùng mã');
      return;
    }
    if (data && data.isExists === true) {
      if (data.soChungSinh !== null) {
        ora.notify.error(`Số chứng sinh "${data.soChungSinh}" đã tồn tại`, 'Lỗi');
        return false;
      }
      ora.notify.error(`Mã "${AppUtilityService.isNullOrEmpty(data.code) ? data.ma : data.code}" đã tồn tại`, 'Lỗi');
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
    this.closeEvent.emit(isSave);
  }

  chuyenCheDoSua() {
    this.isViewDetail = false;
    this.listOfFormItems.forEach((it) => {
      it.disabled = false;
    });
  }

  clearFormInsertContinue() {
    if (!AppUtilityService.isNullOrEmpty(this.initDataCreate)) {
      setTimeout(() => {
        this.id = null;
        this.createUpdateForm.submitted = false;
        this.dataItem = _.cloneDeep(this.initDataCreate);
      });
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const visible = AppUtilityService.isVisibleJquery(this.idJquery);
    if (!visible) {
      return;
    }
    if (this.isShow) {
      if (event.keyCode === KEY_CODE.F11) {
        if (this.viewMode === 'xem') {
          return false;
        }
        if (this.viewMode === 'sua') {
          this.save();
          return false;
        } else {
          this.save(this.tiepTucThem);
          return false;
        }

      }
      if (event.keyCode === KEY_CODE.ESC) {
        this.close();
        return false;
      }
      if (event.keyCode === KEY_CODE.F9 && this.viewMode === 'xem') {
        this.chuyenCheDoSua();
        return false;
      }
    }

  }
}
