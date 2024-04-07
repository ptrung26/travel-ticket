import { ContentChild, Directive, Input } from '@angular/core';
import { TemplateRef } from '@node_modules/@angular/core';
import { OraCellDirective } from './ora-cell.directive';
import { OraHeaderDirective } from './ora-header.directive';
import { COL_DATA_TYPE, Dictionary } from '../models/types';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
@Directive({
  selector: 'ora-column',
})
export class OraColumnDirective {
  @Input() header: string | TemplateRef<any> | null = '';
  @Input() content: string | TemplateRef<{ $implicit: Dictionary }> | null;

  @Input() headerAlign: 'left' | 'right' | 'center' | null;
  @Input() contentAlign: 'left' | 'right' | 'center' | null;
  @Input() align: 'left' | 'right' | 'center' | null;
  @Input() key = '';
  @Input() width: string | null;
  @Input() renderKey = '';
  @Input() dataType: COL_DATA_TYPE;

  @Input()
  get fixLeft() {
    return this._fixLeft;
  }
  set fixLeft(value: boolean) {
    this._fixLeft = coerceBooleanProperty(value);
  }
  private _fixLeft = false;

  @Input()
  get fixRight() {
    return this._fixRight;
  }
  set fixRight(value: boolean) {
    this._fixRight = coerceBooleanProperty(value);
  }
  private _fixRight = false;

  @Input() sort = false;
  @ContentChild(OraCellDirective, { static: true }) tplCell?: OraCellDirective;
  @ContentChild(OraHeaderDirective, { static: true }) tplHeader?: OraHeaderDirective;

  constructor() {}
}
