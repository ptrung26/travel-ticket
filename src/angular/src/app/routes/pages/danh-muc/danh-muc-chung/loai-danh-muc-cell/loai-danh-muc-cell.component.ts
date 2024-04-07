import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { ISelectOptions, SelectOptions } from '@shared/data-common/ora-select/model';
import { Observable } from '@node_modules/rxjs';
import { map } from 'rxjs/operators';
import { HeMayModalService } from '@app/routes/pages/danh-muc/danh-muc-chung/loai-danh-muc-cell/ds-thiet-bi-thuoc-he-may-modal/he-may-modal.service';
import { ChonHeMayModalService } from '@app/routes/pages/danh-muc/danh-muc-chung/loai-danh-muc-cell/chon-he-may-modal.service';
import { CodeSystemDto } from '@app/shared/service-proxies/danh-muc-service-proxies';

@Component({
  selector: 'loai-danh-muc-cell',
  templateUrl: './loai-danh-muc-cell.component.html',
  styleUrls: ['./loai-danh-muc-cell.component.scss'],
  providers: [HeMayModalService, ChonHeMayModalService],
})
export class LoaiDanhMucCellComponent implements OnInit {
  @Input() codeSystemDto: CodeSystemDto;
  loaiDanhMucText$: Observable<string>;

  constructor(
    @Optional() @Inject(SelectOptions) public readonly directive: ISelectOptions,
    public readonly chonHeMayModalService: ChonHeMayModalService,
  ) {}

  ngOnInit(): void {
    this.loaiDanhMucText$ = this.directive.options$.pipe(
      map((options) => {
        return options?.find((x) => x.value === this.codeSystemDto.parentCode)?.displayText;
      }),
    );
    if (this.codeSystemDto.parentCode === 'ThietBi') {
      this.chonHeMayModalService.load(this.codeSystemDto);
    }
  }
}
