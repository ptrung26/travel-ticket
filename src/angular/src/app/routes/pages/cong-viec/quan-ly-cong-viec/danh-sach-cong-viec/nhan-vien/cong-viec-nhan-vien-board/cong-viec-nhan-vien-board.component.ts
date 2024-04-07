import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CreateOrEditCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/danh-sach-cong-viec/create-or-update-cong-viec/create-or-edit-cong-viec.component';
import { CongViecDto, CongViecUserDto, MUC_DO_CONG_VIEC, TRANG_THAI_CONG_VIEC } from '@service-proxies/cong-viec-service-proxies';
import { AppComponentBase } from '@shared/common/AppComponentBase';

@Component({
  selector: 'cong-viec-nhan-vien-board',
  templateUrl: './cong-viec-nhan-vien-board.component.html',
  styleUrls: ['./cong-viec-nhan-vien-board.component.scss'],
})
export class CongViecNhanVienBoardComponent extends AppComponentBase implements OnInit {
  @Input() listCongViec: CongViecDto[] = [];
  @Input() duAn: CongViecDto;
  @Input() permission: any;
  @Input() trangThai: TRANG_THAI_CONG_VIEC;
  @Output() refreshEvent = new EventEmitter<void>();
  @Output() sortingEvent = new EventEmitter<CongViecDto[]>();

  MUC_DO_CONG_VIEC = MUC_DO_CONG_VIEC;
  TRANG_THAI_CONG_VIEC = TRANG_THAI_CONG_VIEC;
  bodyElement = document.body;
  listUser: CongViecUserDto[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}

  suaCongViec(data: CongViecDto) {
    this.modalHelper
      .create(
        CreateOrEditCongViecComponent,
        {
          congViec: data,
          duAnId: this.duAn.id,
          permission: this.permission,
          isCaNhan: data.isCaNhan,
        },
        {
          size: 1300,
          includeTabs: false,
          modalOptions: {
            nzTitle: 'Chi tiết công việc',
          },
        },
      )
      .subscribe((result) => {
        this.refreshEvent.emit();
      });
  }

  dragStart($event) {
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.setProperty('cursor', 'grabbing', 'important');
  }
}
