import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  CommonServiceProxy,
  CongViecDto,
  CongViecUserDto,
  CreateOrUpdateAndHistoryRequest,
  DanhSachCongViecServiceProxy,
  LEVEL_CONG_VIEC,
  MUC_DO_CONG_VIEC, PagingCongViecCaNhanRequest,
  PagingCongViecRequest,
  ROLE_CONG_VIEC,
  SortBySoThuTuRequest,
  TRANG_THAI_CONG_VIEC,
} from '@service-proxies/cong-viec-service-proxies';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@node_modules/@angular/cdk/drag-drop';
import { CongViecCaNhanBoardComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/cong-viec-ca-nhan/cong-viec-ca-nhan-board/cong-viec-ca-nhan-board.component';

@Component({
  selector: 'chi-tiet-cong-viec-ca-nhan',
  templateUrl: './chi-tiet-cong-viec-ca-nhan.component.html',
  styleUrls: ['./chi-tiet-cong-viec-ca-nhan.component.scss'],
})
export class ChiTietCongViecCaNhanComponent implements OnInit {
  @Input() permission: any;
  @Input() duAn: CongViecDto;
  @Output() backListEvent = new EventEmitter<void>();
  @ViewChild('board') congViecCaNhanBoardComp: CongViecCaNhanBoardComponent;

  bodyElement = document.body;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  rfFormGroup: FormGroup;
  thumbnailUrl = './assets/images/tag-icon.svg';
  listTruongPhong = [];
  listLanhDao = [];
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

  ngOnInit(): void {
    if (this.permission.nhanVien) {
      this.getAllTruongPhong();
    }

    if (this.permission.truongPhong) {
      this.getAllLanhDao();
    }

    this.getBoards(this.duAn.id);
  }

  getBoards(id: number) {
    ora.ui.setBusy();
    const formValue = this.rfFormGroup.value;
    const req = new PagingCongViecCaNhanRequest();
    req.parentId = id;
    req.level = LEVEL_CONG_VIEC.CONG_VIEC;
    req.maxResultCount = 1_000;
    req.isGetMyJob = true;
    req.skipCount = 0;
    req.filter = formValue.filter;
    req.ngayTao = formValue.ngayTao;
    req.ngayHoanThanh = formValue.ngayHoanThanh;
    req.sysUserId = formValue.sysUserId;
    req.mucDo = formValue.mucDo;
    this._dataService
      .getlistcongvieccanhan(req)
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

  refresh() {
    this.getBoards(this.duAn.id);
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

  add() {
    this.congViecCaNhanBoardComp.changeVisibleForm();
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
      .subscribe((res) => {});
  }

  removeDrag() {
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';
  }

  getAllTruongPhong() {
    this._commonService.userCongViec(ROLE_CONG_VIEC.TRUONG_PHONG).subscribe((res: CongViecUserDto[]) => {
      this.listTruongPhong = res?.map((item) => ({
        value: item.id,
        displayText: item.hoTen,
      }));
    });
  }

  getAllLanhDao() {
    this._commonService.userCongViec(ROLE_CONG_VIEC.LANH_DAO).subscribe((res: CongViecUserDto[]) => {
      this.listLanhDao = res?.map((item) => ({
        value: item.id,
        displayText: item.hoTen,
      }));
    });
  }
}
