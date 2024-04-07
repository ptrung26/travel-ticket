import { AppConsts } from '@shared/AppConsts';

const AbpEnvironment = AppConsts.abpEnvironment;

export class UrlServices {
  static identityUrl() {
    return AbpEnvironment.apis.default.url;
  }

  static taiKhoanUrl() {
    return AbpEnvironment.apis.taiKhoan.url;
  }


  static danhMucUrl() {
    return AbpEnvironment.apis.danhMuc.url;
  }

  static publishUrl() {
    return AbpEnvironment.apis.publish.url;
  }

  static congViecUrl() {
    return AbpEnvironment.apis.congViec.url;
  }
}

export const ApiNameConfig = {
  identity: {
    apiName: 'identity',
  },
  taiKhoan: {
    apiName: 'tai-khoan',
  },
  danhMuc: {
    apiName: 'danh-muc',
  },
  congViec: {
    apiName: 'cong-viec',
}

};
