import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of as _observableOf, throwError as _observableThrow } from 'rxjs';
import { catchError as _observableCatch, mergeMap as _observableMergeMap } from 'rxjs/operators';
import { ApiException } from './tai-khoan-service-proxies';

@Injectable({providedIn: 'root'})
export abstract class BaseService {
  protected http: HttpClient;
  protected baseUrl: string;
  jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  protected options_: { body?: any; observe: string; responseType: string; headers: HttpHeaders } = {
    observe: 'response',
    responseType: 'blob',
    headers: new HttpHeaders({
      Accept: 'application/json',
    }),
  };

  /**
   * @param requestType (post,get,...)
   *  @param url
   * @param options_
   * @return Success
   */
  protected requestToServer(requestType: 'post' | 'put' | 'get' | 'delete', url: string, opt?: any) {
    let options = opt ? opt : this.options_;

    url = this.baseUrl + url;
    url = url.replace(/[?&]$/, '');

    return this.http
      .request(requestType, url, options)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processData(response_);
        }),
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processData(<any>response_);
            } catch (e) {
              return <Observable<any>>(<any>_observableThrow(e));
            }
          } else {
            return <Observable<any>>(<any>_observableThrow(response_));
          }
        }),
      );
  }

  private processData(response: HttpResponseBase): Observable<any> {
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
          let resultData200 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          return _observableOf(resultData200);
        }),
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap((_responseText) => {
          return throwException('An unexpected server error occurred.', status, _responseText, _headers);
        }),
      );
    }
    return _observableOf<any>(<any>null);
  }
}

function throwException(message: string, status: number, response: string, headers: {
  [key: string]: any
}, result?: any): Observable<any> {
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
