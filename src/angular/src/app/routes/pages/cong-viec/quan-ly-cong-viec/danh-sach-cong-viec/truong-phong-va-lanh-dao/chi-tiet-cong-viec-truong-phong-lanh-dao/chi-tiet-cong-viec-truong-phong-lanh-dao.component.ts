import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  CommonServiceProxy,
  CongViecDto,
  CreateOrUpdateAndHistoryRequest,
  DanhSachCongViecServiceProxy,
  GetCongViecByIdRequest,
  LEVEL_CONG_VIEC,
  MUC_DO_CONG_VIEC,
  PagingCongViecRequest,
  ROLE_CONG_VIEC,
  SortBySoThuTuRequest,
  TRANG_THAI_CONG_VIEC,
  CongViecUserDto,
} from '@service-proxies/cong-viec-service-proxies';
import { DestroyRxjsService } from '@node_modules/@orendaco/of';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@node_modules/@angular/cdk/drag-drop';
import { CongViecTruongPhongLanhDaoBoardComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/truong-phong-va-lanh-dao/cong-viec-truong-phong-lanh-dao-board/cong-viec-truong-phong-lanh-dao-board.component';
import { AppConsts } from '@app/shared/AppConsts';

@Component({
  selector: 'chi-tiet-cong-viec-truong-phong-lanh-dao',
  templateUrl: './chi-tiet-cong-viec-truong-phong-lanh-dao.component.html',
  styleUrls: ['./chi-tiet-cong-viec-truong-phong-lanh-dao.component.scss'],
  providers: [DestroyRxjsService],
})
export class ChiTietCongViecTruongPhongLanhDaoComponent implements OnInit, OnChanges {
  @Input() permission: any;
  @Input() duAn: CongViecDto;
  @Output() backListEvent = new EventEmitter<void>();
  @ViewChild('board') congViecTruongPhongLanhDaoBoardComp: CongViecTruongPhongLanhDaoBoardComponent;

  thumbnailUrl = './assets/images/tag-icon.svg';
  bodyElement = document.body;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  listMucDo = [
    {
      value: MUC_DO_CONG_VIEC.BINH_THUONG,
      displayText: 'Bình thường',
    },
    {
      value: MUC_DO_CONG_VIEC.QUAN_TRONG,
      displayText: 'Quan trọng',
    },
  ];
  listLanhDao = [];
  listUserCaNhan = [];
  rfFormGroup: FormGroup;
  boards = {
    taoMoi: [],
    dangThucHien: [],
    choPheDuyet: [],
    pheDuyet: [],
    hoanThanh: [],
  };

  constructor(private _fb: FormBuilder, private _commonService: CommonServiceProxy, private _dataService: DanhSachCongViecServiceProxy) {
    this.rfFormGroup = this._fb.group({
      filter: '',
      ngayTao: [],
      ngayHoanThanh: [],
      sysUserId: [],
      mucDo: [],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.duAn?.currentValue?.id) {
      this.getBoards(changes.duAn.currentValue.id);
    }
  }

  ngOnInit(): void {
    if (this.permission.truongPhong) {
      this.getAllLanhDao();
    }
    this.getUserCaNhan();
  }

  getById(id: number) {
    ora.ui.setBusy();
    const req = new GetCongViecByIdRequest();
    req.id = id;
    this._dataService
      .getcongviecbyid(req)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.duAn = res;
        }
      });
  }

  getBoards(id: number) {
    ora.ui.setBusy();
    const formValue = this.rfFormGroup.value;
    const req = new PagingCongViecRequest();
    req.parentId = id;
    req.level = LEVEL_CONG_VIEC.CONG_VIEC;
    req.maxResultCount = 1_000;
    req.isGetMyJob = this.permission.nhanVien || this.permission.truongPhong;
    req.skipCount = 0;
    req.filter = formValue.filter;
    req.ngayTao = formValue.ngayTao;
    req.ngayHoanThanh = formValue.ngayHoanThanh;
    req.sysUserId = formValue.sysUserId;
    req.mucDo = formValue.mucDo;
    this._dataService
      .getlist(req)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        this.boards = {
          taoMoi: [],
          dangThucHien: [],
          choPheDuyet: [],
          pheDuyet: [],
          hoanThanh: [],
        };
        res.items?.forEach((data) => {
          this.transferBoards(data);
        });
      });
  }

  refresh() {
    this.getBoards(this.duAn.id);
  }

  transferBoards(data: CongViecDto) {
    switch (data.trangThai) {
      case TRANG_THAI_CONG_VIEC.TAO_MOI:
        this.boards.taoMoi.push(data);
        break;
      case TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN:
        this.boards.dangThucHien.push(data);
        break;
      case TRANG_THAI_CONG_VIEC.CHO_PHE_DUYET:
        this.boards.choPheDuyet.push(data);
        break;
      case TRANG_THAI_CONG_VIEC.PHE_DUYET:
        this.boards.pheDuyet.push(data);
        break;
      case TRANG_THAI_CONG_VIEC.HOAN_THANH:
        this.boards.hoanThanh.push(data);
        break;
      default:
        break;
    }
  }

  add() {
    this.congViecTruongPhongLanhDaoBoardComp.changeVisibleForm();
  }

  close() {
    this.backListEvent.emit();
  }

  dropped(event: CdkDragDrop<CongViecDto[]>, items: CongViecDto[], trangThai: TRANG_THAI_CONG_VIEC) {
    this.removeDrag();
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.sortingCongViec(items);
    } else {
      ora.ui.setBusy();
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      let update = new CreateOrUpdateAndHistoryRequest();
      update.congViecId = event.container.data[event.currentIndex]['id'];
      update.trangThaiCVLon = trangThai;
      this._dataService
        .createorupdatewithhistory(update)
        .pipe(
          finalize(() => {
            ora.ui.clearBusy();
          }),
        )
        .subscribe((res) => {
          if (res.isSuccessful) {
            this.sortingCongViec(items);
            this.refresh();
          } else {
            ora.notify.error(res.errorMessage);
          }
        });
    }
  }

  sortingCongViec(items: CongViecDto[]) {
    ora.ui.setBusy();
    const req = new SortBySoThuTuRequest();
    req.listCongViec = items.map((data, index) => {
      data.soThuTu = index;
      return data;
    });
    this._dataService
      .sortbysothutu(req)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => { });
  }

  removeDrag() {
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';
  }

  getAllLanhDao() {
    this._commonService.userCongViec(ROLE_CONG_VIEC.LANH_DAO).subscribe((res: CongViecUserDto[]) => {
      this.listLanhDao = res?.map((item) => ({
        value: item.id,
        displayText: item.hoTen,
      }));
    });
  }

  getUserCaNhan() {
    ora.ui.setBusy();
    this._commonService
      .userCongViec(ROLE_CONG_VIEC.CA_NHAN)
      .pipe(
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe((res) => {
        this.listUserCaNhan = res.map((data) => {
          data.anhDaiDien = AppConsts.abpEnvironment.apis.taiKhoan.url + `/api/tai-khoan/file/GetAvatar?userId=${data.userId}`;
          return data;
        });
      });
  }
}
