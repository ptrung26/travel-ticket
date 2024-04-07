import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlServices } from '@service-proxies/service-url-config/url-services';
import { CodeSystemDto } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { BASE_HEADER } from '../../resource/utils';

@Injectable({
  providedIn: 'root',
})
export class CodeSystemMapApiResourceService {
  private http: HttpClient;
  private readonly baseUrl: string;

  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
    const baseUrl = UrlServices.danhMucUrl();
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '';
    this.baseUrl = this.baseUrl + '/api/ngoai-kiem/code-system-map';
  }

  getListBySourceId(codeType: string, sourceId: number) {
    let url_ = this.baseUrl + '/by-source/' + sourceId + '?codeType=' + codeType;
    return this.http.get<CodeSystemDto[]>(url_);
  }

  getSourceId(codeType: string, desId: number) {
    let url_ = this.baseUrl + '/source-id/' + desId + '?codeType=' + codeType;
    return this.http.get<number>(url_);
  }

  insert(body: CodeSystemMapEntity) {
    let url_ = this.baseUrl;
    return this.http.post<any>(url_, body, {
      headers: BASE_HEADER,
    });
  }

  remove(id: number) {
    let url_ = this.baseUrl + '/' + id + '/remove';
    return this.http.post<any>(url_, null);
  }

  getSourceName(codeType: string, desId: number) {
    let url_ = this.baseUrl + '/source-name/' + desId + '?codeType=' + codeType;
    return this.http.get<CodeSystemDto>(url_);
  }
}

export interface CodeSystemMapEntity {
  sourceId: number;
  destinationId: number;
  codeType: string | undefined;
  id?: number;
}
