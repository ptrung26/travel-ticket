import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from '@node_modules/rxjs';
import { HTTP_INTERCEPTORS } from '@node_modules/@angular/common/http';
import { AppConsts } from '@shared/AppConsts';

class OpenidFakeIntercept implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const hostUrl = AppConsts.abpEnvironment.oAuthConfig.issuer;
    if (request.url.indexOf('.well-known') > -1) {
      return ok({
        issuer: hostUrl,
        jwks_uri: hostUrl + '/.well-known/openid-configuration/jwks',
        authorization_endpoint: hostUrl + '/connect/authorize',
        token_endpoint: hostUrl + '/connect/token',
        userinfo_endpoint: hostUrl + '/connect/userinfo',
        end_session_endpoint: hostUrl + '/connect/endsession',
        check_session_iframe: hostUrl + '/connect/checksession',
        revocation_endpoint: hostUrl + '/connect/revocation',
        introspection_endpoint: hostUrl + '/connect/introspect',
        device_authorization_endpoint: hostUrl + '/connect/deviceauthorization',
        frontchannel_logout_supported: true,
        frontchannel_logout_session_supported: true,
        backchannel_logout_supported: true,
        backchannel_logout_session_supported: true,
        scopes_supported: ['openid', 'profile', 'email', 'address', 'phone', 'role', 'newPMS', 'offline_access'],
        claims_supported: [
          'sub',
          'birthdate',
          'family_name',
          'gender',
          'given_name',
          'locale',
          'middle_name',
          'name',
          'nickname',
          'picture',
          'preferred_username',
          'profile',
          'updated_at',
          'website',
          'zoneinfo',
          'email',
          'email_verified',
          'address',
          'phone_number',
          'phone_number_verified',
          'role',
        ],
        grant_types_supported: [
          'authorization_code',
          'client_credentials',
          'refresh_token',
          'implicit',
          'password',
          'urn:ietf:params:oauth:grant-type:device_code',
          'LinkLogin',
          'Impersonation',
        ],
        response_types_supported: ['code', 'token', 'id_token', 'id_token token', 'code id_token', 'code token', 'code id_token token'],
        response_modes_supported: ['form_post', 'query', 'fragment'],
        token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
        id_token_signing_alg_values_supported: ['RS256'],
        subject_types_supported: ['public'],
        code_challenge_methods_supported: ['plain', 'S256'],
        request_parameter_supported: true,
      });
    }
    if (request.url.indexOf('abp/application-configuration') > -1) {
      return ok({});
    }
    return next.handle(request);

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }
  }
}

export const openidFakeInterceptorProviders = [{
  provide: HTTP_INTERCEPTORS,
  useClass: OpenidFakeIntercept,
  multi: true,
}];
