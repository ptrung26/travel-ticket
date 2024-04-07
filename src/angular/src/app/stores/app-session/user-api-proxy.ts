import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DateTime} from 'luxon';
import {AppConsts} from '@shared/AppConsts';

const AbpEnvironment = AppConsts.abpEnvironment;

@Injectable({
  providedIn: 'root'
})
export class UserExtensionServiceProxy {
  private http: HttpClient;
  private readonly baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
    this.baseUrl = AbpEnvironment.apis.taiKhoan.url;
  }

  /**
   * @return Success
   */
  userSession(): Observable<UserSessionDto> {
    let url_ = this.baseUrl + '/api/tai-khoan/user-extension/user-session';
    url_ = url_.replace(/[?&]$/, '');
    return this.http.get<UserSessionDto>(url_);
  }
}

export class UserSessionDto implements IUserSessionDto {

  constructor(data?: IUserSessionDto) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  userId!: string;
  username!: string | undefined;
  sysUserId!: number;
  hoTen!: string | undefined;
  khachHangId!: number | undefined;
  tenKhachHang!: string | undefined;
  isBlackList!: boolean | undefined;
  dateBlackList!: DateTime | undefined;
  isChanDangKy!: boolean | undefined;
  rolesLevel!: number | undefined;
  hocVienId!: number | undefined;
  giangVienId!: number | undefined;
  doanDanhGiaId!: number | undefined;
  listPhongBanId!: number[] | undefined;
  listLevel!: number[] | undefined;
  email!: string | undefined;
  soDienThoai!: string | undefined;

  static fromJS(data: any): UserSessionDto {
    data = typeof data === 'object' ? data : {};
    let result = new UserSessionDto();
    result.init(data);
    return result;
  }

  init(_data?: any) {
    if (_data) {
      this.userId = _data['userId'];
      this.username = _data['username'];
      this.sysUserId = _data['sysUserId'];
      this.hoTen = _data['hoTen'];
      this.khachHangId = _data['khachHangId'];
      this.tenKhachHang = _data['tenKhachHang'];
      this.isBlackList = _data['isBlackList'];
      this.dateBlackList = _data['dateBlackList'] ? DateTime.fromISO(_data['dateBlackList'].toString()) : <any>undefined;
      this.isChanDangKy = _data['isChanDangKy'];
      this.rolesLevel = _data['rolesLevel'];
      this.hocVienId = _data['hocVienId'];
      this.giangVienId = _data['giangVienId'];
      this.doanDanhGiaId = _data['doanDanhGiaId'];
      if (Array.isArray(_data['listPhongBanId'])) {
        this.listPhongBanId = [] as any;
        for (let item of _data['listPhongBanId']) {
          this.listPhongBanId!.push(item);
        }
      }
      if (Array.isArray(_data['listLevel'])) {
        this.listLevel = [] as any;
        for (let item of _data['listLevel']) {
          this.listLevel!.push(item);
        }
      }
      this.email = _data['email'];
      this.soDienThoai = _data['soDienThoai'];
    }
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['userId'] = this.userId;
    data['username'] = this.username;
    data['sysUserId'] = this.sysUserId;
    data['hoTen'] = this.hoTen;
    data['khachHangId'] = this.khachHangId;
    data['tenKhachHang'] = this.tenKhachHang;
    data['isBlackList'] = this.isBlackList;
    data['dateBlackList'] = this.dateBlackList ? this.dateBlackList.toString() : <any>undefined;
    data['isChanDangKy'] = this.isChanDangKy;
    data['rolesLevel'] = this.rolesLevel;
    data['hocVienId'] = this.hocVienId;
    data['giangVienId'] = this.giangVienId;
    data['doanDanhGiaId'] = this.doanDanhGiaId;
    if (Array.isArray(this.listPhongBanId)) {
      data['listPhongBanId'] = [];
      for (let item of this.listPhongBanId) {
        data['listPhongBanId'].push(item);
      }
    }
    if (Array.isArray(this.listLevel)) {
      data['listLevel'] = [];
      for (let item of this.listLevel) {
        data['listLevel'].push(item);
      }
    }
    data['email'] = this.email;
    data['soDienThoai'] = this.soDienThoai;
    return data;
  }
}

export interface IUserSessionDto {
  userId: string;
  username: string | undefined;
  sysUserId: number;
  hoTen: string | undefined;
  khachHangId: number | undefined;
  tenKhachHang: string | undefined;
  isBlackList: boolean | undefined;
  dateBlackList: DateTime | undefined;
  isChanDangKy: boolean | undefined;
  rolesLevel: number | undefined;
  hocVienId: number | undefined;
  giangVienId: number | undefined;
  doanDanhGiaId: number | undefined;
  listPhongBanId: number[] | undefined;
  listLevel: number[] | undefined;
  email: string | undefined;
  soDienThoai: string | undefined;
}
