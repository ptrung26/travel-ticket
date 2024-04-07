import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { Observable } from '@node_modules/rxjs';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';
import { BaseStateService } from 'src/shared/base-state.service';

interface State {
  reload: boolean;

  [proName: string]: any;
}

const initialState: State = {
  reload: false,
};

@Injectable({
  providedIn: 'root',
})
export class CommonComboDataStateService extends BaseStateService<State> {
  reload$: Observable<boolean> = this.select((s) => s.reload);

  data$(key: string): Observable<any[]> {
    return this.select((state) => state[key]);
  }

  constructor(
    //private combodataServiceProxy: CombodataServiceProxy,
    private restService: RestService,
  ) {
    super(initialState);
    this.getInitStateFromSession();
  }

  getData(opt: { type: 'table' | 'enum' | 'dictionary' | 'tree'; cascader?: any; name: string; keyCache: string; dataOption?: any }) {
    // setTimeout(() => {
    //   const data = this.state[opt.keyCache];
    //   if (AppUtilityService.isNullOrEmpty(data) === false && (AppUtilityService.isNullOrEmpty(opt.dataOption) || opt.dataOption.length <= 0)) {
    //     return;
    //   }
    //   this.setState({ [opt.keyCache]: [] });
    //   if (opt.type === 'enum') {
    //     this.combodataServiceProxy.appenum(opt.name).subscribe((d) => {
    //       this.setStateAndSession(opt.keyCache, d);
    //     });
    //   } else if (opt.type === 'tree') {
    //     const req: any = {
    //       cascaderId: opt.cascader,
    //       cascaderMa: opt.cascader,
    //       cascaderCode: opt.cascader,
    //       tableName: opt.name
    //     };
    //     if (opt.dataOption && opt.dataOption.length > 0) {
    //       this.setStateAndSession(opt.keyCache, opt.dataOption);
    //     } else {
    //       this.getfromdatabasetreeview(req).subscribe((d) => {
    //         this.setStateAndSession(opt.keyCache, d);
    //       });
    //     }
    //   } else {
    //     const req: any = {
    //       cascaderId: opt.cascader,
    //       cascaderMa: opt.cascader,
    //       cascaderCode: opt.cascader,
    //       tableName: opt.name
    //     };
    //     if(opt.dataOption)
    //     {
    //       if(opt.dataOption.cascaderFieldType == "list")
    //       {
    //         req.cascaderId = null;
    //         req.cascaderMa = null;
    //         req.cascaderCode = null;
    //         req.listcascaderCode = opt.cascader;
    //       }
    //     }
    //     this.combodataServiceProxy.getfromdatabase(req).subscribe((d) => {
    //       this.setStateAndSession(opt.keyCache, d);
    //     });
    //   }
    // });
  }

  clearAll() {
    this.clearState(initialState);
    this.setState({
      reload: false,
    });
    this.setState({
      reload: true,
    });
  }

  clearByKey(name: string) {
    sessionStorage.removeItem(name);
    this.setState({ [name]: null });
  }

  setStateAndSession(proName, data) {
    this.setState({
      [proName]: data,
    });
    const state = this.state;
    sessionStorage.setItem('commonComboDataState', JSON.stringify(state));
  }

  getInitStateFromSession() {
    const s = sessionStorage.getItem('commonComboDataState');
    if (!AppUtilityService.isNullOrEmpty(s)) {
      setTimeout(() => {
        this.setState(JSON.parse(s));
      });
    }
  }

  getfromdatabasetreeview(req) {
    return this.restService.request<any, any>(
      {
        method: 'POST',
        url: '/api/danh-muc/combodata/getfromdatabasetreeview',
        body: req,
      },
      { apiName: 'danhMuc' },
    );
  }
}
