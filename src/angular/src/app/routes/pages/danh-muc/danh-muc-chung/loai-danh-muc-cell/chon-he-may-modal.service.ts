import { Injectable } from '@angular/core';
import { CodeSystemMapApiResourceService } from '@app/routes/pages/danh-muc/danh-muc-chung/resource/code-system-map-api-resource.service';
import { CodeSystemDto, CodeSystemServiceProxy } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { Input } from '@node_modules/@angular/core';

@Injectable()
export class ChonHeMayModalService {
  @Input() codeSystemDto: CodeSystemDto;
  isVisible = false;
  heMayId = 0;
  tenHeMay = '';
  heMayItems: CodeSystemDto[] = [];
  codeType = 'HeMay_ThietBi';

  constructor(
    private _dataService: CodeSystemServiceProxy,
    private readonly resourceService: CodeSystemMapApiResourceService,
    private codeSystemMapApiResourceService: CodeSystemMapApiResourceService,
  ) {}

  load(codeSystemDto: CodeSystemDto) {
    this.codeSystemDto = codeSystemDto;
    this.codeSystemMapApiResourceService.getSourceName('HeMay_ThietBi', this.codeSystemDto.id).subscribe((v) => {
      if (v) {
        this.tenHeMay = v.display;
        this.heMayId = v.id;
      }
    });
  }

  open() {
    this.isVisible = true;
    this._dataService
      .getlist({
        parentCode: 'HeMayThietBi',
        skipCount: 0,
        maxResultCount: 1000,
      } as any)
      .subscribe((data) => {
        this.heMayItems = data?.items || [];
      });
  }

  close() {
    this.isVisible = false;
  }

  save() {
    if (this.heMayId > 0) {
      this.resourceService
        .insert({
          codeType: this.codeType,
          sourceId: this.heMayId,
          destinationId: this.codeSystemDto.id,
        })
        .subscribe(() => {
          ora.notify.success('Thêm thành công ' + this.codeSystemDto.display);
          const heMayItem = this.heMayItems.find((x) => x.id === this.heMayId);
          this.tenHeMay = heMayItem?.display;
          this.close();
        });
    }
  }
}
