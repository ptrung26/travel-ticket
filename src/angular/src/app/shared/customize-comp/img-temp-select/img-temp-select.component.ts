import { Component, EventEmitter, forwardRef, Input, OnInit, Provider, Output, Injector } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDataImgOut, ImgTempModalComponent } from '@app/shared/customize-comp/img-temp-modal/img-temp-modal.component';
import { base64ToFile } from '@node_modules/ngx-image-cropper';
import { combineLatest, Observable, Subject } from '@node_modules/rxjs';
import { debounceTime, filter, takeUntil } from '@node_modules/rxjs/internal/operators';
import { BlobContainerType } from '@service-proxies/CustomsType';
import { AppConsts } from '@shared/AppConsts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import { AppComponentBase } from '@app/shared/common/AppComponentBase';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImgTempSelectComponent),
  multi: true,
};

// const imgLinkBase: string = AppConsts.imageServerUrl + '/api/danh-muc/File/GoToViewImage'; // Để tạm đường dẫn này sửa sau

@Component({
  selector: 'img-temp-select',
  templateUrl: './img-temp-select.component.html',
  styleUrls: ['./img-temp-select.component.scss'],
  providers: [VALUE_ACCESSOR],
})
export class ImgTempSelectComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
  _value = '';
  _isDisabled = false;
  imgByteArrSource = '';
  _imgIdLinkInit = '';
  _imgIdInit: string;
  private _blobContainer: BlobContainerType;
  $blobContainer = new Subject<BlobContainerType>();

  @Input() set blobContainer(v: BlobContainerType) {
    this.$blobContainer.next(v);
    this._blobContainer = v;
  }

  get blobContainer() {
    return this._blobContainer;
  }
  @Input() isCircleImg = false;
  @Input() tileModal = 'Sửa ảnh';
  @Input() srcImgDefault = '/assets/common/images/ko-mon-an.svg';
  @Input() imgWidth = '150px';
  @Input() imgHeight = '100%';
  @Input() showBtnButton = false;
  @Input() imgWidthNeed = 150;
  @Output() imgSrcChange = new EventEmitter<string>();
  @Input() isOpenPopUp = true;
  @Input() aspectRatio = true;

  $imgIdLinkInit = new Subject<string>();

  @Input() set imgIdLinkInit(imgId: string) {
    this.$imgIdLinkInit.next(imgId);
  }

  get imgIdLinkInit(): string {
    return this._imgIdLinkInit;
  }

  get value() {
    return this._value;
  }

  @Input() set value(v: string) {
    this._value = v;
  }

  @Input()
  get disabled() {
    return this._isDisabled;
  }

  set disabled(v: boolean) {
    this._isDisabled = v;
  }

  $destroy = new Subject<boolean>();

  constructor(private msg: NzMessageService, private injector: Injector) {
    super(injector);
    combineLatest([
      this.$imgIdLinkInit.pipe(filter((x) => !ora.equalEmpty(x, ''))),
      this.$blobContainer.pipe(filter((x) => !ora.equalEmpty(x, ''))),
    ])
      .pipe(takeUntil(this.$destroy), debounceTime(500))
      .subscribe((result) => {
        this._blobContainer = result[1];
        this._imgIdInit = result[0];
        this._imgIdLinkInit = AppConsts.getLinkShowImage(result[0], result[1]);
      });
  }

  ngOnInit() {}

  private onChange: Function = (v: string) => {};
  private onTouched: Function = () => {};

  showSelecImgModal() {
    if (this.isOpenPopUp) {
      this.modalHelper
        .create(
          ImgTempModalComponent,
          {
            imgWidthNeed: this.imgWidthNeed,
            aspectRatio: this.aspectRatio,
            blobContainer: this.blobContainer,
          },
          {
            size: 'md',
            includeTabs: false,
            modalOptions: {
              nzTitle: this.tileModal,
            },
          },
        )
        .subscribe((result: IDataImgOut) => {
          if (result) {
            this.imgByteArrSource = result.imgByte;
            this.imgSrcChange.emit(result.imgByte);
            this.onChange(result.fileToken);
          }
        });
    }
  }

  deleteImg() {
    this.imgByteArrSource = '';
    this._imgIdInit = '';
    this._imgIdLinkInit = '';
    this.imgSrcChange.emit('');
    this.onChange(null);
  }

  writeValue(obj: string): void {
    this._value = obj;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  xoaAnh() {}
}
