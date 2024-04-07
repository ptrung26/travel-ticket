import { UrlServices } from './url-services';
import { API_BASE_URL as Identity_URL } from '@shared/service-proxies/identity-service-proxies';
import { API_BASE_URL as TAIKHOAN_URL } from '@shared/service-proxies/tai-khoan-service-proxies';
import { API_BASE_URL as DANHMUC_URL } from '@shared/service-proxies/danh-muc-service-proxies';
import { API_BASE_URL as CONGVIEC_URL } from '@shared/service-proxies/cong-viec-service-proxies';
export const UrlProvider = [
  { provide: Identity_URL, useFactory: UrlServices.identityUrl },
  { provide: TAIKHOAN_URL, useFactory: UrlServices.taiKhoanUrl },
  { provide: DANHMUC_URL, useFactory: UrlServices.danhMucUrl },
  { provide: CONGVIEC_URL, useFactory: UrlServices.congViecUrl },
];
