import { Pipe, PipeTransform } from '@angular/core';
import { AppConsts } from '@app/shared/AppConsts';
import { BlobContainerType } from '@app/shared/service-proxies/CustomsType';

@Pipe({
  name: 'showImage',
})
export class ShowImagePipe implements PipeTransform {
  transform(value: string, type: BlobContainerType): unknown {
    return AppConsts.getLinkShowImage(value, type);
  }
}
