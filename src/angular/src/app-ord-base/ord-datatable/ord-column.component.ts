import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DatatableComponent } from './ord-datatable.component';

export interface OrdActionColumn {
  actionType?: 'chi-tiet' | 'xoa' | 'them' | 'sua' | 'khac';
  name?: string;
  icon?: string;
  // đường dẫn ảnh của thư mục assets/images/thao-tac-icon
  img?: string;
  imgWidth?: number;
  nzIcon?: string;
  callBack: any;
  nzTypeBtn?: 'primary' | 'default' | 'dashed' | 'danger' | 'link';
  iconType?: 'nzIcon' | 'icon' | 'img';
  hideAction?:any // ẩn action use: hideAction:true||false or hideAction:(item)=>{code here return boolean;}
}

@Component({
  selector: 'ord-column',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdColumnComponent {
  @Input() dataField: string;
  @Input() header: string;
  @Input() width: number;
  @Input() cellAlign: 'left' | 'center' | 'right';
  @Input() isActionColumn = false;
  @Input() nzLeft = false;
  @Input() isCheckbox = false;
  @Input() hiddenColumn = false;
  @Input() isSort = false;
  @Input() sortField = '';
  @Input() isEllipsis? = false; //cắt chuỗi khi dài vượt width
  @ContentChild('cell') cellTemplate: TemplateRef<any>;

  constructor(public table: DatatableComponent) {
    table.addColumn(this);
  }
}
