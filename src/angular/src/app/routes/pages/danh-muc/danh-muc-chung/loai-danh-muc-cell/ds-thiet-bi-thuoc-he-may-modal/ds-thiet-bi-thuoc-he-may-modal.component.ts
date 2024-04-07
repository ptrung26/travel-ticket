import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HeMayModalService } from '@app/routes/pages/danh-muc/danh-muc-chung/loai-danh-muc-cell/ds-thiet-bi-thuoc-he-may-modal/he-may-modal.service';
import { debounceTime } from 'rxjs/operators';
import { DestroyRxjsService } from '../../../../../../../shared/destroy-rxjs.service';
import { takeUntil } from '@node_modules/rxjs/operators';
import { OCoreUtilityService } from '@node_modules/@orendaco/of';
import { CodeSystemMapApiResourceService } from '@app/routes/pages/danh-muc/danh-muc-chung/resource/code-system-map-api-resource.service';
import { CodeSystemDto } from '@app/shared/service-proxies/danh-muc-service-proxies';

@Component({
  selector: 'ds-thiet-bi-thuoc-he-may-modal',
  templateUrl: './ds-thiet-bi-thuoc-he-may-modal.component.html',
  styleUrls: ['./ds-thiet-bi-thuoc-he-may-modal.component.scss'],
  providers: [DestroyRxjsService],
})
export class DsThietBiThuocHeMayModalComponent implements OnInit {
  @Input() codeSystemDto: CodeSystemDto;
  totalThietBi = 0;
  listThietBi: CodeSystemDto[] = [];
  listVm: CodeSystemDto[] = [];
  codeType = 'HeMay_ThietBi';

  constructor(
    public readonly heMayModalService: HeMayModalService,
    private cdr: ChangeDetectorRef,
    private readonly resourceService: CodeSystemMapApiResourceService,
    private d$: DestroyRxjsService,
  ) {
    this.heMayModalService.cdr = cdr;
  }

  ngOnInit(): void {
    this.refresh();
    this.refreshDaGan();
    this.heMayModalService.rfFormGroup
      .get('filterThietBiDaCo')
      .valueChanges.pipe(debounceTime(100), takeUntil(this.d$))
      .subscribe((v) => {
        this.searchTrongDanhSachThietBiDaChon();
      });
  }

  searchTrongDanhSachThietBiDaChon() {
    const v = this.heMayModalService.rfFormGroup.get('filterThietBiDaCo').value;
    if (v) {
      this.listVm = this.listThietBi.filter(
        (f) => OCoreUtilityService.filterSearch(f.display, v) || OCoreUtilityService.filterSearch(f.code, v),
      );
    } else {
      this.listVm = this.listThietBi;
    }
  }

  refresh() {
    this.heMayModalService.refresh();
    this.cdr.detectChanges();
  }

  addThietBi(data: CodeSystemDto) {
    if (!this.listThietBi.find((x) => x.id === data.id)) {
      this.resourceService
        .insert({
          codeType: this.codeType,
          sourceId: this.codeSystemDto.id,
          destinationId: data.id,
        })
        .subscribe(() => {
          // ora.notify.success('Thêm thành công ' + data.display + ' vào hệ máy ' + this.codeSystemDto.display);
          this.listThietBi.push(data);
          this.heMayModalService.rfFormGroup.get('filterThietBiDaCo').patchValue('');
          this.refreshDaGan();
        });
    }
  }

  refreshDaGan() {
    this.resourceService.getListBySourceId(this.codeType, this.codeSystemDto.id).subscribe((lst) => {
      this.listThietBi = lst;
      this.listVm = lst;
    });
  }

  removeThietBi(data: CodeSystemDto) {
    this.resourceService.remove(data.parentId).subscribe(() => {
      ora.notify.success('Bỏ thành công thiết bị ' + data.display + ' ra khỏi hệ máy ' + this.codeSystemDto.display);
      this.listThietBi = this.listThietBi.filter((x) => {
        return x.parentId !== data.parentId;
      });
      this.cdr.markForCheck();
      this.searchTrongDanhSachThietBiDaChon();
    });
  }

  trackByItem(idx: number, data: CodeSystemDto) {
    return data.id;
  }

  addMulti(items: CodeSystemDto[]) {
    items.forEach((it) => {
      this.addThietBi(it);
    });
  }
}
