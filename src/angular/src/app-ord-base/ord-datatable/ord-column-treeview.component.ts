import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DatatableTreeViewComponent } from './ord-datatable-treeview.component';

@Component({
  selector: 'ord-column-treeview',
  template: ``
})
export class OrdColumnTreeViewComponent {
  @Input() dataField: string;
  @Input() header: string;
  @Input() width: number;
  @Input() cellAlign: 'left' | 'center' | 'right';
  @Input() isActionColumn = false;
  @Input() nzLeft = false;

  @ContentChild('cell') cellTemplate: TemplateRef<any>;

  constructor(public table: DatatableTreeViewComponent) {
    table.addColumn(this);
  }

}
