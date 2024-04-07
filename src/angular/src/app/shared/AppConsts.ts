import { Environment } from '@node_modules/@abp/ng.core';
import { BlobContainerType } from '@service-proxies/CustomsType';
import { ApiNameConfig, UrlServices } from '@service-proxies/service-url-config/url-services';

export class AppConsts {
  // static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

  static remoteServiceBaseUrl: string; // bỏ giá trị này
  // static remoteServiceBaseUrlFormat: string;
  // static appBaseUrl: string;
  // static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
  static abpEnvironment: Environment;

  static get imageServerUrl() {
    return AppConsts.abpEnvironment ? AppConsts.abpEnvironment?.apis?.images?.url : '';
  }

  static get baseUrl() {
    return '';
  }

  static getLinkShowImage(imgName: string, type: BlobContainerType) {
    return this.imageServerUrl + `/api/danh-muc/file/GoToViewImage?blobContainer=${type}&&imgName=${imgName}`;
    // return this.imageServerUrl + `/api/file-manager/GoToViewImage?imgName=${imgName}&&blobContainer=${type}`;
  }
}
