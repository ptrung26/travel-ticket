// import { Injectable } from '@angular/core';
// import { OfSelectApiModel, OfSelectCascadeModel } from '@node_modules/@orendaco/of';
// import { CommonServiceProxy, HuyenComboboxRequest } from '@service-proxies/danh-muc-service-proxies';
// import { OfSelectBaseModelConfig } from '@node_modules/@orendaco/of/lib/models/of-select-base.model';
// import { OfSelectCascadeModelConfig } from '@node_modules/@orendaco/of/lib/components/of-select-cascade/of-select-cascade-model';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class SelectBuilderService {
//   constructor(private selectSp: CommonServiceProxy) {}
//
//   tinh(config: OfSelectBaseModelConfig = null): OfSelectApiModel {
//     if (config === null) {
//       config = {
//         label: 'Tỉnh',
//         dataField: 'maTinh',
//       };
//     }
//     return new OfSelectApiModel({
//       ...config,
//       functionService: this.selectSp.danhmuctinhcombo(),
//       keyCache: 'tinh',
//     });
//   }
//
//   huyen(cascadeField: string, config: OfSelectBaseModelConfig): OfSelectCascadeModel {
//     if (config === null) {
//       config = {
//         label: 'Huyện',
//         dataField: 'maHuyen',
//       };
//     }
//     return new OfSelectCascadeModel({
//       ...config,
//       cascadeField: cascadeField,
//       functionService: (cascade) => {
//         const body = new HuyenComboboxRequest();
//         body.tinhId = cascade;
//         return this.selectSp.danhmuchuyencombo(body);
//       },
//     });
//   }
// }
