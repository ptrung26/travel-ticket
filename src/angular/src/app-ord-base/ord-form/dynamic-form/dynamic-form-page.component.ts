import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from '@node_modules/rxjs';
import { TranslatePipe } from '@node_modules/@ngx-translate/core';
import { Select } from '@node_modules/@ngxs/store';
import { trackBy } from '@abp/ng.core';
import { debounceTime, takeUntil } from '@node_modules/rxjs/internal/operators';
import { IOrdFormItemBase } from './ord-form-item-base';
import { DestroyRxjsService } from 'src/shared/destroy-rxjs.service';
import { ValidateDynamicFormComponent } from './validate-dynamic-form.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
// không định nghĩa thêm tại đây
// định nghĩa thêm tại ord-form-item-base.ts
// thank u :)
// tslint:disable-next-line:no-empty-interface
export interface OrdFormItem extends IOrdFormItemBase { }

@Component({
  selector: 'ord-dynamic-form',
  templateUrl: './dynamic-form-page.component.html',
  styleUrls: ['./dynamic-form-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslatePipe, DestroyRxjsService],
})
export class DynamicFormPageComponent implements OnInit, AfterViewInit {
  // @Select(AppSessionState.userSession) userSession$: Observable<UserSessionDto>;
  // private userSession: UserSessionDto;
  @ViewChild('formValidView', { static: false }) formValidView: ValidateDynamicFormComponent;
  @Input() dataForm: any = {};
  @Output() dataFormChange = new EventEmitter();
  @Input() listOfFormItems: OrdFormItem[] = [];
  @Input() dynamicFormItemTemplate: TemplateRef<any>;
  @Output() searchEvent = new EventEmitter();
  @Output() refreshFilterEvent = new EventEmitter();
  @Output() resetSearchEvent = new EventEmitter();
  @Input() layout: 'horizontal' | 'vertical' = 'vertical';
  @Input() focusFirstItem = true;
  @Input() setSessionIntoDataForm = false;
  keyControlElementId = Number(new Date());
  submitted = false;
  @Input() urlUploadFile: string;
  // thêm btn search vào cuối form
  @Input() hasBtnSearchBottom = false;
  trackByDataField = trackBy<OrdFormItem>('dataField');
  changeDetector$ = new BehaviorSubject<number>(Number(new Date()));

  constructor(private translatePipe: TranslatePipe, private destroy$: DestroyRxjsService, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (AppUtilityService.isNullOrEmpty(this.dataForm)) {
      this.dataForm = {};
    }
    this.keyControlElementId = Number(new Date());
    this.init$();
    this.setPlaceholder();
  }

  init$() {
    // this.userSession$.pipe(takeUntil(this.destroy$)).subscribe((userSession) => {
    //   this.userSession = userSession;
    //   if (this.setSessionIntoDataForm === true) {
    //     this.dataForm.sessionReadOnly = { ...userSession };
    //   }
    //   // set true để giữ lại các giá trị nếu not null (dùng khi khởi tạo form)
    //   this.setFormDataWhenInitView();
    // });
  }

  /// truyền list OrdFormItem từ component bên ngoài
  setListOfFormItems(listItems: OrdFormItem[]) {
    this.listOfFormItems = _.cloneDeep(listItems);
    this.setPlaceholder();
  }

  private setPlaceholder() {
    _.forEach(this.listOfFormItems, (f: OrdFormItem) => {
      // set placeholder mặc định = label
      if (AppUtilityService.isNullOrEmpty(f.placeholder)) {
        f.placeholder = f.label;
      }

      if (AppUtilityService.isNullOrEmpty(f.size)) {
        f.size = 'default';
      }

      f.placeholder = this.translatePipe.transform(f.placeholder);
      let isSelectControl = f.type === 'select';
      isSelectControl = isSelectControl || (f.type === 'form-builder' && f?.option?.formBuilderType.toLowerCase().indexOf('select') > -1);
      if (isSelectControl && f.placeholder.indexOf('-') !== 0) {
        f.placeholder = `- ${f.placeholder} -`;
      }
    });
  }

  // validate và lấy giá trị form
  getDataForm(): any {
    return this.formValidView.getDataForm();
  }

  trackByFn(index: number, item: OrdFormItem) {
    return item.dataField;
  }

  setFormDataWhenInitView() {
    this.resetForm(true);
  }

  onResetFormData() {
    if (AppUtilityService.isNullOrEmpty(this.dataForm)) {
      this.dataForm = {};
    }
    // if (this.userSession && this.setSessionIntoDataForm) {
    //   this.dataForm.sessionReadOnly = { ...this.userSession };
    // }
    this.submitted = false;
    this.resetForm(false);
  }

  private resetForm(isIgnoreIfNotNull: boolean) {
    _.forEach(this.listOfFormItems, (formItem: OrdFormItem) => {
      if (isIgnoreIfNotNull === true && !AppUtilityService.isNullOrEmpty(this.dataForm[formItem.dataField])) {
        this.dataForm[formItem.dataField] = this.dataForm[formItem.dataField];
        return;
      }
      if (!AppUtilityService.isNullOrEmpty(formItem.initDataValue)) {
        const strInitData = '' + formItem.initDataValue;
        // if (strInitData.indexOf('session') === 0) {
        //   if (!AppUtilityService.isNullOrEmpty(this.userSession)) {
        //     if (strInitData === 'sessionBenhVienId') {
        //       this.dataForm[formItem.dataField] = this.userSession.donViCoSoId;
        //       return;
        //     }
        //     if (strInitData === 'sessionTinhId') {
        //       this.dataForm[formItem.dataField] = this.userSession?.donViCoSoDto?.maTinh;
        //       return;
        //     }
        //     if (strInitData === 'sessionHuyenId') {
        //       this.dataForm[formItem.dataField] = this.userSession?.donViCoSoDto?.maHuyen;
        //       return;
        //     }
        //     if (strInitData === 'sessionXaId') {
        //       this.dataForm[formItem.dataField] = this.userSession?.donViCoSoDto?.maXa;
        //       return;
        //     }
        //   }
        // }
        this.dataForm[formItem.dataField] = formItem.initDataValue;
        return;
      }
      if (formItem.type === 'check-box') {
        this.dataForm[formItem.dataField] = false;
        return;
      }
      this.dataForm[formItem.dataField] = null;
    });
  }

  ngAfterViewInit(): void {
    this.cdref.detectChanges();
    this.changeDetector$.pipe(takeUntil(this.destroy$), debounceTime(1000)).subscribe((d) => {
      setTimeout(() => {
        this.cdref.detectChanges();
      });
    });
  }

  onChangeDataOfForm(dto) {
    this.dataFormChange.emit(dto);
  }

  triggerDetectChanges() {
    this.cdref.detectChanges();
  }
}
