import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import * as moment from '@node_modules/moment';
import * as $ from 'jquery';
import {OrdFormItem} from '../ord-form/dynamic-form/dynamic-form-page.component';

@Injectable()
export class AppUtilityService {
  constructor() {
  }

  static removeDau(str: string): string {
    if (this.isNullOrEmpty(str)) {
      return str;
    }
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    return str;
  }

  static IsNullValidateForm = function (_htmlId: string) {
    if (this.isNullOrEmpty(_htmlId)) {
      return true;
    }
    let _listElement = document.getElementById(_htmlId).querySelectorAll('.custom-error-validate') as NodeListOf<HTMLElement>;
    if (_listElement != null && _listElement.length > 0) {
      _listElement.forEach((_element) => {
        _element.style.display = 'inline';
      });
      return true;
    } else {
      return false;
    }
  };
  static IsInValidDataForm = function (_htmlId: string) {
    if (this.isNullOrEmpty(_htmlId)) {
      return true;
    }
    let _listElement = document.getElementById(_htmlId).querySelectorAll('.invalid-data-form') as NodeListOf<HTMLElement>;
    if (_listElement != null && _listElement.length > 0) {
      _listElement.forEach((_element) => {
        _element.style.display = 'inline';
      });
      return true;
    } else {
      return false;
    }
  };

  // do not check validate when the first open form
  static PauseValidateForm = function (_htmlId: string) {
    if (this.isNullOrEmpty(_htmlId)) {
      return;
    } else {
      let form = document.getElementById(_htmlId);
      if (form) {
        let _listElement = document.getElementById(_htmlId).querySelectorAll('.custom-error-validate') as NodeListOf<HTMLElement>;
        if (_listElement != null && _listElement.length > 0) {
          _listElement.forEach((_element) => {
            _element.style.display = 'none';
          });
        }
      }
    }
  };

  static getFullTextSearch(str) {
    if (this.isNullOrEmpty(str)) {
      return '';
    }
    str += '';
    str = this.removeDau(str);
    str = str.replace(/\s\s+/g, ' ');
    return str;
  }

  static searchVietTat(str) {
    if (this.isNullOrEmpty(str)) {
      return str;
    }
    let ret = '';
    const spl = str.split(' ');
    if (this.isNotAnyItem(spl) === false) {
      spl.forEach((s) => {
        if (s.length > 0) {
          ret = ret + s[0];
        }
      });
    }
    return this.getFullTextSearch(_.cloneDeep(ret));
  }

  static isNullOrWhiteSpace(input: any): boolean {
    if (typeof input === 'undefined' || input == null || input == 'null') {
      return true;
    }
    if (typeof input == 'object') {
      return typeof input === 'undefined' || input === null || input === '';
    }
    if (typeof input == 'string') {
      return input.replace(/\s/g, '').length < 1;
    }
  }

  static isNullOrEmpty(input: any): boolean {
    return typeof input === 'undefined' || input === null || input === '';
    // return !(typeof input !== 'undefined' && input && input !== '' && input !== null);
  }

  static isNotNull(input: any): boolean {
    return !this.isNullOrEmpty(input);
  }

  static isWhitespace(value: string): boolean {
    return (value || '').trim().length === 0;
  }

  static isEqTrue(input: any): boolean {
    // tslint:disable-next-line:triple-equals
    return typeof input !== 'undefined' && input && input !== '' && input == true;
  }

  static removeAccents(str) {
    const accentsMap = [
      'aàảãáạăằẳẵắặâầẩẫấậ',
      'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
      'dđ',
      'DĐ',
      'eèẻẽéẹêềểễếệ',
      'EÈẺẼÉẸÊỀỂỄẾỆ',
      'iìỉĩíị',
      'IÌỈĨÍỊ',
      'oòỏõóọôồổỗốộơờởỡớợ',
      'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
      'uùủũúụưừửữứự',
      'UÙỦŨÚỤƯỪỬỮỨỰ',
      'yỳỷỹýỵ',
      'YỲỶỸÝỴ',
    ];
    // tslint:disable-next-line:prefer-for-ord-sf
    for (let i = 0; i < accentsMap.length; i++) {
      const re = new RegExp('[' + accentsMap[i].substr(1) + ']', 'g');
      const char = accentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }

  static validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  static validateNumber = (number) => {
    let re = /^[0-9]{1,10}$/;
    return re.test(String(number).toLowerCase());
  };
  static validateNumberCCCD = (number) => {
    let re = /^[0-9]{1,12}$/;
    return re.test(String(number).toLowerCase());
  };

  static validateNumberPhone(value: string) {
    const regex_SDT_Ban: RegExp =
      /^(\()?([0])?2((\d{2}(\)|\.)?(\ )?(\d)(\.)?(\d{3})(\.)?(\d{3}))|((4)|(8))(\)|\.)?(\ )?(\d{2})(\.)?(\d{3})(\.)?(\d{3}))$/;
    const regex_SDT_Dd: RegExp = /^([0])?(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-9])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    if (value) {
      if (regex_SDT_Dd.test(value) === false && regex_SDT_Ban.test(value) === false) {
        return false
      }
      return true;
    }
    return true;
    // const check = value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);
    // return !!check;
  }

  static validateMoment = (_dateTime) => {
    return _dateTime.isValid();
  };
  static validateDatetime = (_dateTime) => {
    let check = moment(_dateTime, 'DD/MM/YYYY', true).isValid();
    return moment(_dateTime, 'DD/MM/YYYY', true).isValid();
  };
  static compareDatetime = (_dateTime1, _dateTime2, isFullHour) => {
    let date1 = _dateTime1;
    let date2 = _dateTime2;
    if (!isFullHour) {
      date1 = AppUtilityService.setDefaultDatetime(new Date(_dateTime1));
      date2 = AppUtilityService.setDefaultDatetime(new Date(_dateTime2));
    }

    return date1.getTime() - date2.getTime();
  };

  static setDefaultDatetime(_dateTime) {
    _dateTime.setHours(0, 0, 0, 0);
    return _dateTime;
  }

  static validatePassword(value: string) {
    const check = value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    //const check = value.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/);
    return !!check;
  }

  static isNotAnyItem(input): boolean {
    return this.isNullOrEmpty(input) || input.length === 0;
  }

  static splitSwitchPathMenu(path: string, idx: number): string {
    const arr = path.split('/', 2);
    if (AppUtilityService.isNullOrEmpty(arr[idx])) {
      return '';
    }
    return arr[idx];
  }

  // chuyển giá trị số --> string để truyền vào form select
  static convertIntToStringPropertyOfObject(obj): void {
    if (this.isNullOrEmpty(obj)) {
      return;
    }
    if (Array.isArray(obj)) {
      if (this.isNotAnyItem(obj)) {
        return;
      }
      obj.forEach((it) => {
        this.convertIntToStringPropertyOfObject(it);
      });
    } else {
      Object.keys(obj).forEach((key) => {
        const typeKey = typeof obj[key];
        if (typeKey === 'number') {
          obj[key] = '' + obj[key];
        } else if (typeKey === 'object') {
          this.convertIntToStringPropertyOfObject(obj[key]);
        }
      });
    }
  }

  static unflatten(list: any[]) {
    // tslint:disable-next-line:prefer-const
    let map = {},
      node,
      roots = [],
      i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      node.key = AppUtilityService.isNullOrEmpty(node.parentId) ? '' : node.parentId + '-';
      node.key = node.key + node.id;
      node.isLeaf = this.checkIsLeaf(list, node.id);
      if (node.parentId > 0) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  static checkIsLeaf(list: any[], id) {
    // tslint:disable-next-line:triple-equals
    const f = list.find((x) => x.parentId == id);
    return AppUtilityService.isNullOrEmpty(f);
  }

  static getDisplayText(lst, value) {
    if (AppUtilityService.isNotAnyItem(lst)) {
      return '';
    }
    // tslint:disable-next-line:triple-equals
    const f = lst.find((x) => x.value == value);
    if (AppUtilityService.isNullOrEmpty(f)) {
      return '';
    }
    return f.displayText;
  }

  static isNumeric(n): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  static isEmpty(value): boolean {
    return !value || !/[^\s]+/.test(value);
  }

  static getControlForm(lstForm: any[], df): OrdFormItem {
    return lstForm.find((it) => it.dataField === df);
  }

  static megerDiaChi(soNha, thon, xa, huyen, tinh) {
    let dc = this.isNullOrEmpty(soNha) ? '' : soNha;
    if (!AppUtilityService.isNullOrEmpty(thon)) {
      dc = dc + `- ${thon}`;
    }
    if (!AppUtilityService.isNullOrEmpty(xa)) {
      dc = dc + `- ${xa}`;
    }
    if (!AppUtilityService.isNullOrEmpty(huyen)) {
      dc = dc + `- ${huyen}`;
    }
    if (!AppUtilityService.isNullOrEmpty(tinh)) {
      dc = dc + `- ${tinh}`;
    }
    return dc;
  }

  static camelcaseToPascalCase(o) {
    const newObj: any = {};
    // tslint:disable-next-line:forin
    for (const p in o) {
      newObj[p.substring(0, 1).toLowerCase() + p.substring(1)] = o[p];
    }
    return newObj;
  }

  static dateToStr(date) {
    if (AppUtilityService.isNullOrEmpty(date)) {
      return '';
    }
    return moment(date).format('DD/MM/YYYY');
  }

  static strToDate(strDate: string): Date {
    if (AppUtilityService.isNullOrEmpty(strDate)) {
      return null;
    }
    const pattern = new RegExp(/(\d{2})\/(\d{2})\/(\d{4})/);
    strDate = strDate.replace(/ /g, '');
    if (pattern.test(strDate)) {
      return new Date(strDate.replace(pattern, '$3-$2-$1'));
    }
    return null;
  }

  static getAge(dob: Date): {
    years: number;
    months: number;
    days: number;
  } {
    const now = new Date();
    const yearNow = now.getFullYear();
    const monthNow = now.getMonth();
    const dateNow = now.getDate();
    const yearDob = dob.getFullYear();
    const monthDob = dob.getMonth();
    const dateDob = dob.getDate();

    let yearAge = yearNow - yearDob;
    let monthAge = 0;
    let dateAge = 0;

    if (monthNow >= monthDob) {
      monthAge = monthNow - monthDob;
    } else {
      yearAge--;
      monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob) {
      dateAge = dateNow - dateDob;
    } else {
      monthAge--;
      dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }
    return {
      years: yearAge,
      months: monthAge,
      days: dateAge,
    };
  }

  static inputOnlyNumber(value: string) {
    const reg = /^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    if (reg.test(value)) {
      return Number(value);
    }
    return null;
  }

  static formatNumber(value): string {
    if (AppUtilityService.isNullOrEmpty(value)) {
      value = 0;
    }
    let data = parseFloat(value).toFixed(2) + '';
    const tempList = data.split('.');
    if (tempList.length <= 1) {
      data += '.00';
    }
    const stringValue = `${data}`;
    const list = stringValue.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `.${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `,${list[1]}` : ''}`;
  }

  static getYearSelectOptions(): any[] {
    const n = new Date().getFullYear();
    const lst: any[] = [];
    for (let y = n; y >= 1900; y--) {
      lst.push({
        value: y + '',
        label: y + '',
      });
    }
    return lst;
  }

  static getMonthSelectOptions(): any[] {
    const lst: any[] = [];
    for (let m = 1; m <= 12; m++) {
      lst.push({
        value: m.toString(),
        label: m.toString(),
      });
    }
    return lst;
  }

  static getQuarterSelectOptions(): any[] {
    const lst: any[] = [];
    for (let q = 1; q <= 4; q++) {
      lst.push({
        value: q.toString(),
        label: q.toString(),
      });
    }
    return lst;
  }

  static currentMonth() {
    return Number(moment().format('M'));
  }

  static currentQuarter(): number {
    const month = this.currentMonth();
    const excess = month % 3;
    return excess > 0 ? parseInt((month / 3).toString(), 0) + 1 : parseInt((month / 3).toString(), 0);
  }

  static currentYear() {
    return moment().year();
  }

  static getListValuesFromEnums(enums: any): any[] {
    return Object.keys(enums).filter((item) => {
      return isNaN(Number(item));
    });
  }

  static getTuoiBenhNhan(dto: any): any {
    const dnow = new Date();
    const yNow = new Date().getFullYear();
    dto.tuoi = '';
    dto.donViTuoi = '';
    if (AppUtilityService.isNotNull(dto.namSinh) && dto.namSinh <= yNow && dto.namSinh > 1900) {
      const nam = dnow.getFullYear() - dto.namSinh;
      if (nam > 0 || AppUtilityService.isNullOrEmpty(dto.thangSinh)) {
        dto.donViTuoi = 'Tuổi';
        dto.tuoi = nam;
        return dto;
      }
      if (AppUtilityService.isNotNull(dto.thangSinh)) {
        const thang = dnow.getMonth() + 1 - dto.thangSinh;
        if (thang < 0) {
          return dto;
        }
        if (thang > 0 || AppUtilityService.isNullOrEmpty(dto.ngaySinh)) {
          dto.donViTuoi = 'Tháng';
          dto.tuoi = thang;
          return dto;
        }
      }
      if (AppUtilityService.isNotNull(dto.ngaySinh)) {
        const ngay = dnow.getDate() - Number(moment(dto.ngaySinh).format('DD'));
        if (ngay >= 0) {
          dto.donViTuoi = 'Ngày';
          dto.tuoi = ngay;
          return dto;
        }
      }
    }
    return dto;
  }

  static arrayIncrease(start: number, end: number, offset = 1): number[] {
    const arr = [];
    for (let i = start; i <= end; i = i + offset) {
      arr.push(i);
    }
    return arr;
  }

  static textCapitalize(txt: string) {
    if (AppUtilityService.isNullOrEmpty(txt)) {
      return '';
    }
    txt = txt.toLowerCase();
    txt = txt.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
    return txt;
  }

  static isDuocPhamTiemChung(loaiVatTuId) {
    if (AppUtilityService.isNullOrEmpty(loaiVatTuId)) {
      return false;
    }
    return +loaiVatTuId === 5 || +loaiVatTuId === 6;
  }

  static isVisibleJquery(id: string) {
    return $('#' + id).is(':visible');
  }

  static calculateYearOld(birthday) {
    let toDays = Date.now();
    let birthdays = Date.parse(birthday);
    let soNam = moment.duration(toDays - birthdays, 'milliseconds').asDays() / 365.25;
    if (soNam < 3) {
      let soThang = moment.duration(toDays - birthdays, 'milliseconds').asDays() / 30.4375;
      return (soThang > 1 ? soThang.toFixed(0) : 1) + ' tháng tuổi';
    } else {
      return soNam.toFixed(0) + ' tuổi';
    }
  }

  static getSessionTinh() {
    let _arrMaTinh = [];
    const key = 'tinh-combo-data';
    const cache = sessionStorage.getItem(key);
    if (cache) {
      _arrMaTinh = JSON.parse(cache).map((m) => m.value);
      return _arrMaTinh;
    } else {
      setTimeout(function () {
        const key = 'tinh-combo-data';
        const cache = sessionStorage.getItem(key);
        if (cache) {
          _arrMaTinh = JSON.parse(cache).map((m) => m.value);
          return _arrMaTinh;
        }
      });
    }
  }

  static autoFormatName(str: string) {
    let arrChars = str.toLowerCase().split(' ');
    let strNew = '';
    arrChars.forEach((item) => {
      if (!AppUtilityService.isNullOrWhiteSpace(item)) {
        strNew += item + ' ';
      }
    });
    strNew = strNew.substring(0, strNew.length - 1);
    str = strNew.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
    return str;
  }

  static convertBase64ToPdf(base64) {
    // Decode base64 using atob method
    let raw = window.atob(base64);
    // Create an array to store the decoded data
    let uInt8Array = new Uint8Array(raw.length);
    // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.

    const blob = new Blob([uInt8Array], {type: 'application/pdf'});

    return blob;
  }

  static getNumber(value: string) {
    if (value) {
      return parseFloat(value);
    } else {
      return 0;
    }
  }

  static convertToNumberObject(value: any) {
    const listProperty = Object.getOwnPropertyNames(value);
    if (listProperty && listProperty.length > 0) {
      listProperty.forEach((property) => {
        if (typeof value[property] === 'number') {
          value[property] = AppUtilityService.getNumber(value[property]?.toString());
        }
      });
    }
  }

  static getFileNameByFilePath(path: string) {
    return path.match(/^.*?([^\\/.]*)[^\\/]*$/)[1] + '.' + path.substring(path.lastIndexOf('.') + 1);
  }

  //#region Đào tạo
  static getAlphabetByIndex(idx: number) {
    const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if (idx < 26) {
      return arr[idx];
    } else {
      if (idx % 26 === 0) {
        let numIdx = (idx / 26) - 1;
        return arr[numIdx] + arr[0];
      } else {
        return arr[Math.floor(idx / 26) - 1] + arr[idx % 26];
      }
    }
  }

  static convertHtmlToText(html) {
    if (html) {
      html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
      html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
      html = html.replace(/<\/div>/ig, '\n');
      html = html.replace(/<\/li>/ig, '\n');
      html = html.replace(/<li>/ig, '  *  ');
      html = html.replace(/<\/ul>/ig, '\n');
      html = html.replace(/<\/p>/ig, '\n');
      html = html.replace(/<br\s*[\/]?>/gi, '\n');
      html = html.replace(/<[^>]+>/ig, '');
      html = html.replace(/&nbsp;/g, ' ');
      return html;
    }
    return '';
  }

  static formatSeconds(seconds, typeFomart) {

    let secondsRemaining = seconds;
    let hoursRemaining = Math.floor(secondsRemaining / (60 * 60));
    let minutesRemaining = secondsRemaining % (60 * 60);

    let hourMinutesRemaining = Math.floor(minutesRemaining / 60);
    let minuteSecondsRemaining = minutesRemaining % 60;
    let hourSecondsRemaining = Math.ceil(minuteSecondsRemaining);

    let fHrs = this.convertTimeToRound(hoursRemaining);
    let fMins = this.convertTimeToRound(hourMinutesRemaining);
    let fSecs = this.convertTimeToRound(hourSecondsRemaining);

    if (typeFomart === 'thoi_luong') {

      if (hoursRemaining === 0 && hourMinutesRemaining === 0 && hourSecondsRemaining == 0) {
        return '-';
      }

      if (hoursRemaining === 0) {
        return fMins + 'm' + fSecs + 's';
      }
      return fHrs + 'h' + fMins + 'm' + fSecs + 's';
    }

    if (hoursRemaining === 0) {
      return fMins + ':' + fSecs;
    }

    return fHrs + ':' + fMins + ':' + fSecs;
  }

  static convertTimeToRound(number) {
    var s = String(number);
    if (s.length === 1) {
      s = '0' + s;
    }
    return s;
  }

  //#endregion
}
