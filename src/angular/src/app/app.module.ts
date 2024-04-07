import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppPreBootstrap } from '@app/AppPreBootstrap';
import { UrlProvider } from '@service-proxies/service-url-config/url-provider';
import { AppConsts } from '@shared/AppConsts';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { CoreModule } from '@abp/ng.core';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from './app.component';
import { GlobalConfigModule } from './global-config.module';
import { LayoutModule } from '@shared/layout/layout.module';
import { RoutesModule } from './routes/routes.module';

//#region default language
import { registerLocale } from '@abp/ng.core/locale';
import { environment } from '@env/environment';
import { default as ngLang } from '@angular/common/locales/vi';
import { DELON_LOCALE, en_US as delonLang } from '@delon/theme';
import { vi as dateLang } from 'date-fns/locale';
import { NZ_DATE_LOCALE, NZ_I18N, vi_VN as zorroLang } from 'ng-zorro-antd/i18n';
//register angular
import { PlatformLocation, registerLocaleData } from '@angular/common';
//#endregion
//#region Startup Service
//#region translate
import { TranslateModuleConfig } from '@node_modules/@ngx-translate/core/public_api';
import { TranslateLoader, TranslateModule } from '@node_modules/@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OraSpinModule } from '@shared/ora-spin/ora-spin.module';
import { AppInitService } from './app-init.service';
import { openidFakeInterceptorProviders } from '../app-ord-base/http-intercept/openid-fake-intercept';
import { authInterceptorProviders } from 'src/app-ord-base/http-intercept/auth.interceptor';
import { OrdAppNgxState } from '@app/stores';
import { FullCalendarModule } from '@fullcalendar/angular';

const LANG = {
  abbr: 'vi',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang,
};

registerLocaleData(LANG.ng, LANG.abbr);
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: NZ_DATE_LOCALE, useValue: LANG.date },
  { provide: DELON_LOCALE, useValue: LANG.delon },
];
//import { NgClockPickerLibModule } from 'ng-clock-picker-lib';
//import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const translateConfig: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },

  defaultLanguage: 'vi',
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initializeApp1(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}

//#endregion

export function appInitializerFactory(injector: Injector, platformLocation: PlatformLocation) {
  return () => {
    return new Promise<boolean>((resolve, reject) => {
      AppPreBootstrap.run(injector, () => {
        resolve(true);
      });
    });
  };
}

const APPINIT_PROVIDES = [
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [Injector, PlatformLocation],
    multi: true,
  },
];

//#endregion Startup Service
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GlobalConfigModule.forRoot(),
    CoreModule.forRoot({
      environment: AppConsts.abpEnvironment,
      registerLocaleFn: registerLocale(),
      skipGetAppConfiguration: true,
    }),
    TranslateModule.forRoot(translateConfig),
    NgxsModule.forRoot([...OrdAppNgxState], { developmentMode: !environment.production }),
    LayoutModule,
    RoutesModule,
    NzNotificationModule,
    FullCalendarModule,
    OraSpinModule.forRoot(),
  ],
  providers: [
    AppInitService,
    { provide: APP_INITIALIZER, useFactory: initializeApp1, deps: [AppInitService], multi: true },
    ...LANG_PROVIDES,
    ...APPINIT_PROVIDES,
    ...UrlProvider,
    openidFakeInterceptorProviders,
    authInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
