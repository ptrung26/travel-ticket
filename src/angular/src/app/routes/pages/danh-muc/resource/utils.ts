import { HttpHeaders } from '@angular/common/http';

export const BASE_HEADER = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'text/plain',
});

export function setParamter(url: string, prm: any[]) {
  prm.forEach((v) => {
    url = url + '/' + encodeURIComponent(v);
  });
  return url;
}
