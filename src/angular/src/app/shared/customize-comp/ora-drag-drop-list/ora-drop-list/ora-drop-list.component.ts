import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDropList } from '@angular/cdk/drag-drop';
import { ElementRef, EventEmitter, TemplateRef } from '@node_modules/@angular/core';
import { Observable, of, Subject } from '@node_modules/rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ora-drop-list',
  templateUrl: './ora-drop-list.component.html',
  styleUrls: ['./ora-drop-list.component.scss', './box-style.component.scss'],
})
export class OraDropListComponent<T = any> implements OnInit, AfterViewInit {
  $dropList: Observable<CdkDropList>;
  @Input() type: 'list' | 'box' | 'custom' = 'list';
  @ViewChild('dropList') private _dropList: CdkDropList;
  @Input() dataSource: T[] = [];
  // Kéo thả đi đâu
  @Input() $connectedTo: Subject<CdkDropList[] | CdkDropList>;
  @Input() content: string | TemplateRef<{ $implicit: T }> | null = '';
  //Phạm vi di chuyển của Component
  @Input() dragBoundary: string | ElementRef<HTMLElement> | HTMLElement;

  editSuccess = false;

  @Input() emptyText = 'Kéo thả vào đây để thêm món ăn';

  get showEmpty() {
    return this.dataSource.length === 0;
  }

  private _usingCustomPlaceholder = true;
  @Input() set usingCustomPlaceholder(value: any) {
    this._usingCustomPlaceholder = coerceBooleanProperty(value);
  }

  get usingCustomPlaceholder() {
    return this._usingCustomPlaceholder;
  }

  private _sortingDisabled = false;
  @Input() set sortingDisabled(value: any) {
    this._sortingDisabled = coerceBooleanProperty(value);
  }

  get sortingDisabled() {
    return this._sortingDisabled;
  }

  private _usingDropDefault = false;
  @Input() set usingDropDefault(value: boolean) {
    this._usingDropDefault = coerceBooleanProperty(value);
  }

  get usingDropDefault() {
    return this._usingDropDefault;
  }

  @Output() dropped: EventEmitter<CdkDragDrop<T[], any>> = new EventEmitter<CdkDragDrop<T[], any>>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.$dropList = of(this._dropList);
    });
  }

  drop($event: CdkDragDrop<T[], any>) {
    if (this.usingDropDefault) {
      if ($event.previousContainer === $event.container) {
        moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
      } else {
        transferArrayItem($event.previousContainer.data, $event.container.data, $event.previousIndex, $event.currentIndex);
      }
    } else {
      this.dropped.emit($event);
    }
  }

  onEnter($event: CdkDragEnter<T[]>) {}

  onEdited($event: CdkDragExit<T[]>) {}
}
