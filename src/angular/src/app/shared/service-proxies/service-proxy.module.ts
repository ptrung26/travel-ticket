import { NgModule } from '@angular/core';
import { BaseServiceProxies } from './base-service-proxies.service';
import * as CongViec from './cong-viec-service-proxies';
import * as DanhMuc from './danh-muc-service-proxies';
import * as File from './file-service-proxies';
import * as Identity from './identity-service-proxies';
import * as TaiKhoan from './tai-khoan-service-proxies';

const DanhMucServiceProxy = [
  DanhMuc.DanhMucTinhServiceProxy,
  DanhMuc.DanhMucHuyenServiceProxy,
  DanhMuc.DanhMucXaServiceProxy,
  DanhMuc.DanhMucQuocTichServiceProxy,
  DanhMuc.NhaPhanPhoiServiceProxy,
  DanhMuc.NhaTaiTroServiceProxy,
  DanhMuc.CommonServiceProxy,
  DanhMuc.AccountServiceProxy,
  DanhMuc.AbpServiceProxy,
  DanhMuc.OrdApplicationConfigurationServiceProxy,
  DanhMuc.QuanLyCanBoServiceProxy,
  DanhMuc.QuanLyXuongThucHanhServiceProxy,
];
const TaiKhoanServiceProxy = [
  Identity.PermissionsServiceProxies,
  Identity.UserServiceProxies,
  Identity.RolesServiceProxies,
  Identity.ProfileServiceProxies,
  TaiKhoan.SysRoleServiceProxy,
  TaiKhoan.TaiKhoanBaseCustomServiceProxy,
  TaiKhoan.PermissionBaseCustomServiceProxy,
  TaiKhoan.PermissionManagementServiceProxy,
  TaiKhoan.OrganizationunitsServiceProxy,
  TaiKhoan.UserExtensionServiceProxy,
  TaiKhoan.TaiKhoanNoAuthServiceProxy,
  TaiKhoan.SysNotificationsServiceProxy,
  TaiKhoan.SettingManagementServiceProxy,
];
const CongViecServiceProxy = [
  CongViec.DanhSachCongViecServiceProxy,
  CongViec.CommonServiceProxy,
  CongViec.HanhDongPhongNguaServiceProxy,
  CongViec.HanhDongKhacPhucServiceProxy,
];
const FileServiceProxy = [File.FileServiceProxies];

@NgModule({
  providers: [...DanhMucServiceProxy, ...TaiKhoanServiceProxy, ...CongViecServiceProxy, ...FileServiceProxy, BaseServiceProxies],
})
export class ServiceProxyModule {}
