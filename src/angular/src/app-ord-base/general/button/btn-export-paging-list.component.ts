import { Component, Input, OnInit } from '@angular/core';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { RestService } from '@node_modules/@abp/ng.core';

@Component({
  selector: 'btn-export-paging-list',
  template: `
    <button dropdowntoggle="" type="button" data-toggle="dropdown" aria-haspopup="true"
            class="btn btn-outline-success margin-left-5" nz-dropdown [nzDropdownMenu]="menuExport"
            nzTrigger="hover"><i nz-icon nzType="cloud-download" nzTheme="outline"></i> Xuất danh sách
    </button>
    <nz-dropdown-menu #menuExport="nzDropdownMenu">
      <ul nz-menu>
        <li nz-submenu nzTitle="Trang hiện tại">
          <ul>
            <li nz-menu-item (click)="exportClick(false,1)">
              <i class="fa fa-file-excel margin-right-5"></i>Excel
            </li>
            <li nz-menu-item (click)="exportClick(false,2)">
              <i class="fa fa-file-pdf margin-right-5"></i>Pdf
            </li>
            <li nz-menu-item (click)="exportClick(false,3)">
              <i class="fa fa-file-word margin-right-5"></i>Doc
            </li>
          </ul>
        </li>
        <li nz-submenu nzTitle="Tất cả">
          <ul>
            <li nz-menu-item (click)="exportClick(true,1)">
              <i class="fa fa-file-excel margin-right-5"></i>Excel
            </li>
            <li nz-menu-item (click)="exportClick(true,2)">
              <i class="fa fa-file-pdf margin-right-5"></i>Pdf
            </li>
            <li nz-menu-item (click)="exportClick(true,3)">
              <i class="fa fa-file-word margin-right-5"></i>Doc
            </li>
          </ul>
        </li>
      </ul>
    </nz-dropdown-menu>
  `
})
export class BtnExportPagingListComponent implements OnInit {
  @Input() pagingInput = {};
  @Input() url = '';
  apiName = 'Niis';

  constructor(
    //private spinnerService: NgxSpinnerService,
    private restService: RestService) {

  }

  ngOnInit(): void {
  }

  exportClick(isAll, extension) {
    const req: any = {
      ...this.pagingInput
    };
    const url = `/api/niis/${this.url}/getlisttofile?isAll=${isAll}&fileType=${extension}`;
    //this.spinnerService.show();
    this.restService.request<any, any>(
      {
        method: 'POST',
        url,
        body: req
      },
      { apiName: this.apiName }
    )
      .pipe(finalize(() => {
        //this.spinnerService.hide();
      }))
      .subscribe(d => {
        this.downloadTempFile(d);
      });
  }

  private downloadTempFile(file: any) {
    // const url = khamChuaBenhUrl() + '/File/DownloadTempFile?fileType=' + file.fileType + '&fileToken=' + file.fileToken + '&fileName=' + file.fileName;
    // location.href = url;
  }
}
