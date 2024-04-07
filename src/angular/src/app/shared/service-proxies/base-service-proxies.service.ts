import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { Observable, of as _observableOf, throwError as _observableThrow } from 'rxjs';
import { catchError as _observableCatch, mergeMap as _observableMergeMap } from 'rxjs/operators';
import { AppConsts } from '../AppConsts';
import { ApiException, RemoteServiceErrorResponse } from './tai-khoan-service-proxies';
import { ResponseResult } from './dto/remote-service-error.response';

export const BASE_API_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({ providedIn: 'root' })
export class BaseServiceProxies {
  protected http: HttpClient;
  protected baseUrl: string;
  jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(injector: Injector, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(BASE_API_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = AppConsts.baseUrl;
  }

  post(domainUrl: string, urlApi: string, body: any | undefined): Observable<ResponseResult> {
    let url_ = (domainUrl ? domainUrl : this.baseUrl) + urlApi;
    url_ = url_.replace(/[?&]$/, '');

    const content_ = JSON.stringify(body);

    let options_: any = {
      body: content_,
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      }),
    };

    return this.http
      .request('post', url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processPost(response_);
        }),
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processPost(<any>response_);
            } catch (e) {
              return <Observable<ResponseResult>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<ResponseResult>>(<any>_observableThrow(response_));
          }
        }),
      );
  }

  protected processPost(response: HttpResponseBase): Observable<ResponseResult> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse ? response.body : (<any>response).error instanceof Blob ? (<any>response).error : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result200: any = null;
          let resultData200 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result200 = ResponseResult.fromJS(resultData200);
          return _observableOf(result200);
        }),
      );
    } else if (status === 403) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result403: any = null;
          let resultData403 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result403 = RemoteServiceErrorResponse.fromJS(resultData403);
          return throwException('Forbidden', status, _responseText, _headers, result403);
        }),
      );
    } else if (status === 401) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result401: any = null;
          let resultData401 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result401 = RemoteServiceErrorResponse.fromJS(resultData401);
          return throwException('Unauthorized', status, _responseText, _headers, result401);
        }),
      );
    } else if (status === 400) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result400: any = null;
          let resultData400 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result400 = RemoteServiceErrorResponse.fromJS(resultData400);
          return throwException('Bad Request', status, _responseText, _headers, result400);
        }),
      );
    } else if (status === 404) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result404: any = null;
          let resultData404 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result404 = RemoteServiceErrorResponse.fromJS(resultData404);
          return throwException('Not Found', status, _responseText, _headers, result404);
        }),
      );
    } else if (status === 501) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result501: any = null;
          let resultData501 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result501 = RemoteServiceErrorResponse.fromJS(resultData501);
          return throwException('Server Error', status, _responseText, _headers, result501);
        }),
      );
    } else if (status === 500) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          let result500: any = null;
          let resultData500 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          result500 = RemoteServiceErrorResponse.fromJS(resultData500);
          return throwException('Server Error', status, _responseText, _headers, result500);
        }),
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException('An unexpected server error occurred.', status, _responseText, _headers);
        }),
      );
    }
    return _observableOf<ResponseResult>(<any>null);
  }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any }, result?: any): Observable<any> {
  if (result !== null && result !== undefined) {
    return _observableThrow(result);
  } else {
    return _observableThrow(new ApiException(message, status, response, headers, null));
  }
}

function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
    if (!blob) {
      observer.next('');
      observer.complete();
    } else {
      let reader = new FileReader();
      reader.onload = (event) => {
        observer.next((<any>event.target).result);
        observer.complete();
      };
      reader.readAsText(blob);
    }
  });
}

export class FileDto {
  fileName!: string;
  fileType!: string | undefined;
  fileToken!: string;
  fileBytes!: string | undefined;
  fileBase64!: string | undefined;
  isSuccess!: boolean;
}

export class PagingRequest {
  filter!: string | undefined;
  isActive!: boolean | undefined;
  sorting!: string | undefined;
  skipCount!: number;
  maxResultCount!: number;

  constructor() {
    this.filter = '';
    this.isActive = true;
    this.sorting = 'Id desc';
    this.skipCount = 0;
    this.maxResultCount = 20;
  }
}

export class PagedResultDto<T = any> {
  items: T[];
  totalCount: number;
}
