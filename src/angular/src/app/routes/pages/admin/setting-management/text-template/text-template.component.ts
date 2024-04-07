import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from '@node_modules/rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { CreateOrEditTextTemplateComponent } from './create-or-edit.component';
import { SettingManagementServiceProxy, TextTemplateDto } from '@service-proxies/tai-khoan-service-proxies';

@Component({
  selector: 'list-text-template',
  templateUrl: './text-template.component.html',
  styleUrls: ['./text-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class TextTemplateComponent extends PagedListingComponentBase<TextTemplateDto> implements OnInit {
  rfFormGroup: FormGroup;

  constructor(injector: Injector, private _dataService: SettingManagementServiceProxy, private fb: FormBuilder) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      filter: '',
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  clear() {
    this.rfFormGroup.reset();
    this.refresh();
  }

  showCreateOrEditModal(dataItem?: TextTemplateDto): void {
    this.modalHelper
      .create(
        CreateOrEditTextTemplateComponent,
        { dataItem: dataItem },
        {
          size: 'lg',
          includeTabs: false,
          modalOptions: {
            nzTitle: 'Sửa mẫu email: ' + dataItem.name,
          },
        },
      )
      .subscribe((result) => {
        if (result) {
          this.refresh();
        }
      });
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
    // const input: PagingConfigSystemRequest = new PagingConfigSystemRequest();
    // input.maxResultCount = request.maxResultCount;
    // input.skipCount = request.skipCount;
    // input.sorting = request.sorting;
    // const formValue = this.rfFormGroup.value;
    // input.filter = formValue.filter;
    // this._dataService
    //   .getlist(input)
    //   .pipe(finalize(finishedCallback))
    //   .subscribe((result) => {
    //     this.dataList = result.items;
    //     this.showPaging(result);
    //   });
  }
}
