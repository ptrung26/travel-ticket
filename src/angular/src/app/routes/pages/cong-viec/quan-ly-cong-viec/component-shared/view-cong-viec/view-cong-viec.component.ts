import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CongViecDto, DanhSachCongViecServiceProxy, MUC_DO_CONG_VIEC } from '@service-proxies/cong-viec-service-proxies';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { AppConsts } from '@shared/AppConsts';

interface FlatNode {
  expandable: boolean;
  ten: string;
  mucDo: number;
  level: number;
  data: CongViecDto;
  disabled: boolean;
}

@Component({
  selector: 'view-cong-viec',
  templateUrl: './view-cong-viec.component.html',
  styleUrls: ['./view-cong-viec.component.scss'],
})
export class ViewCongViecComponent implements OnInit {

  sourceAvatar = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=`;
  congViecId: number;
  dataItem: CongViecDto;
  MUC_DO_CONG_VIEC = MUC_DO_CONG_VIEC;
  toDay = new Date();

  selectListSelection = new SelectionModel<CongViecDto>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  private transformer = (node: CongViecDto, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    ten: node.ten,
    mucDo: node.mucDo,
    level,
    data: node,
    disabled: false,
  });

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  constructor(private _dataService: DanhSachCongViecServiceProxy) {
  }

  ngOnInit(): void {
    this.toDay.setHours(0, 0, 0, 0);
    this.getById(this.congViecId);
  }

  getById(id: number) {
    ora.ui.setBusy();
    this._dataService.viewcongviecbyid(id).pipe(
      finalize(() => {
        ora.ui.clearBusy();
      }),
    ).subscribe(res => {
      if (res.isSuccessful) {
        this.dataItem = res.dataResult;
        this.initTree();
      }
    });
  }

  initTree() {
    this.dataSource.setData([this.dataItem]);
    this.treeControl.expandAll();
  }

  compareDateTime(date) {
    return date ? this.toDay.getTime() - (date.toJSDate().setHours(0, 0, 0, 0)) <= 0 : true;
  }

  percent(soViecDaHoanThanh: number, soViec: number) {
    return Math.ceil(soViecDaHoanThanh * 100 / soViec);
  }
}
