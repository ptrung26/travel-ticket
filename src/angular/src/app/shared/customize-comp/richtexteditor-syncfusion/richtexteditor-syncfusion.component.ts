import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Provider,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@app/shared/common/AppComponentBase';
import { fromEvent, Subject } from '@node_modules/rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from '@node_modules/rxjs/operators';
import {
  ToolbarService,
  LinkService,
  ImageService,
  TableService,
  MarkdownEditorService,
  QuickToolbarService,
  ResizeService,
  PasteCleanupService,
  HtmlEditorService,
  FileManagerService,
  RichTextEditorComponent,
} from '@syncfusion/ej2-angular-richtexteditor';
import { UrlServices } from '../../service-proxies/service-url-config/url-services';

declare const ClassicEditor: any;

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextEditorSyncfusionComponent),
  multi: true,
};

@Component({
  selector: 'richtexteditor',
  template: ` <ejs-richtexteditor
    #fromRTE
    [saveInterval]="saveInterval"
    (change)="onChangeValue($event)"
    [(value)]="value"
    [height]="height"
    [width]="width"
    [toolbarSettings]="toolbarSettings"
    [fileManagerSettings]="fileManagerSettings"
  >
  </ejs-richtexteditor>`,
  styleUrls: [],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, FileManagerService, VALUE_ACCESSOR],
})
export class RichTextEditorSyncfusionComponent extends AppComponentBase implements OnInit, ControlValueAccessor, OnDestroy, AfterViewInit {
  @ViewChild('fromRTE', { static: true }) rteEle: RichTextEditorComponent;
  // @ViewChild('valueTemplate') valueTemplate: TemplateRef;
  // public hostUrl: string = UrlServices.portalUrl();
  public hostUrl = '';
  public height = 360;
  public width = 1000;
  public toolbarSettings: object = {
    type: 'MultiRow',
    items: [
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'LowerCase',
      'UpperCase',
      '|',
      'Formats',
      'Alignments',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateLink',
      'Image',
      'FileManager',
      '|',
      'ClearFormat',
      'Print',
      'SourceCode',
      'FullScreen',
      '|',
      'Undo',
      'Redo',
    ],
  };
  public fileManagerSettings: object = {
    enable: true,
    path: '/',
    ajaxSettings: {
      url: this.hostUrl + '/api/portal/file-manager/fileoperations',
      getImageUrl: this.hostUrl + '/api/portal/file-manager/getimage',
      uploadUrl: this.hostUrl + '/api/portal/file-manager/upload',
      downloadUrl: this.hostUrl + '/api/portal/file-manager/download',
    },
  };
  public saveInterval = 500;
  _value = '';
  _isDisabled = false;
  editor: any;
  $destroy: Subject<boolean> = new Subject<boolean>();
  $eventChange = new Subject<string>();
  $setValue: Subject<any> = new Subject<any>();

  @Input() readonly = false;

  @Input() get value() {
    return this._value;
  }

  set value(v: any) {
    this._value = v;
  }

  @Input()
  get disabled() {
    return this._isDisabled;
  }

  set disabled(v: boolean) {
    this._isDisabled = v;
  }

  constructor(injector: Injector) {
    super(injector);
  }

  private onChange: Function = (v: any) => {};
  private onTouched: Function = () => {};

  ngOnInit() {
    this.$eventChange.pipe(takeUntil(this.$destroy), debounceTime(100)).subscribe((res) => {
      this.onChange(res);
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // this.$destroy.next(true);
    // this.$destroy.unsubscribe();
    // if (this.editor) {
    //   this.editor.destroy().catch((error) => { });
    // }
  }

  onChangeValue($event: any): void {
    this.value = $event.value;
    this.$eventChange.next($event.value);
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  writeValue(obj: any): void {
    this.value = obj;
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
}
