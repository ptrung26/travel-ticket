import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CAPluginService {

    constructor() { }

    baseUrl = "http://localhost:8888";

    getToken() {
        var tokenUrl = this.baseUrl + "/GetToken";
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.post(tokenUrl);
    }

    getCert(token: string) {
        var url = this.baseUrl + "/GetCert";
        var param = { token: token };
        return this.post(url, param);
    }

    signHash(token: string, base64Hash: string, serialNumber: string) {
        var url = this.baseUrl + "/SignHash";
        var param = { token: token, data: base64Hash, serialNumber: serialNumber };
        var cert = this.post(url, param);
        return cert;
    }

    post(_url, _param = null, _callback = null) {
        var request = new XMLHttpRequest();;

        request.open("POST", _url, false);
        request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            if (_param != null) {
                var query = JSON.stringify(_param);
                //console.log("query :"+query);
                request.send(query);
            } else {
                request.send();
            }
            if (request.readyState == 4 && request.status == 200) {
                var response = request.responseText;
                if (_callback != null) {
                    _callback.call(this, response);
                } else {
                    return response;
                }
            }
        } catch (e) {
            return "";
        }
    }
}