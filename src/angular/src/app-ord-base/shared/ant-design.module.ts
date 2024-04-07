import {NgModule} from '@angular/core';
import {NZ_DATE_LOCALE, NZ_I18N, vi_VN} from 'ng-zorro-antd/i18n';
import {NZ_ICONS} from 'ng-zorro-antd/icon';
import {vi as viDate} from 'date-fns/locale';
import {registerLocaleData} from '@angular/common';
import vi from '@angular/common/locales/vi';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {IconDefinition} from '@ant-design/icons-angular';
import {SHARED_ZORRO_MODULES} from '@shared/shared-zorro.module';

registerLocaleData(vi);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);
const antModule = [
  ...SHARED_ZORRO_MODULES
];

@NgModule({
  declarations: [],
  exports: [antModule],
  providers: [
    {provide: NZ_I18N, useValue: vi_VN},
    {provide: NZ_ICONS, useValue: icons},
    {provide: NZ_DATE_LOCALE, useValue: viDate}
  ]
})
export class AntDesignModule {
}
