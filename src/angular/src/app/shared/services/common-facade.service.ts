// import { AbstractType, Injectable, InjectionToken, Injector, Type } from '@angular/core';
// import { NzModalService } from 'ng-zorro-antd/modal';
// import { SelectBuilderService } from '@shared/forms/select-builder.service';
// import { ModalHelper } from '@node_modules/@delon/theme';
// import { DanhmuchuyenServiceProxy } from '@service-proxies/danh-muc-service-proxies';
//
// export abstract class CommonFacadeService {
//   private _injector;
//   private _service: any = {};
//
//   protected constructor(_injector: Injector) {
//     this._injector = _injector;
//   }
//
//   public lazyLoadService<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>) {
//     const tokenName = token.toString();
//     if (!this._service[tokenName]) {
//       this._service[tokenName] = this._injector.get(token);
//     }
//     return this._service[tokenName];
//   }
//
//   get modalService() {
//     return this.lazyLoadService(NzModalService);
//   }
//
//   get selectBuilderService() {
//     return this.lazyLoadService(SelectBuilderService);
//   }
//
//   get modalHelper(): ModalHelper {
//     return this.lazyLoadService(ModalHelper);
//   }
//
//   /// ServiceProxy
//   get danhmuchuyenServiceProxy(): DanhmuchuyenServiceProxy {
//     return this.lazyLoadService(DanhmuchuyenServiceProxy);
//   }
// }
