import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {GetUserSession} from './action';
import {environment} from '@env/environment';
import {ConfigStateService} from '@node_modules/@abp/ng.core';
import {OrdApplicationConfigurationServiceProxy} from '@service-proxies/danh-muc-service-proxies';
import {forkJoin} from 'rxjs';
import {UserExtensionServiceProxy, UserSessionDto} from '@app/stores/app-session/user-api-proxy';

export class AppSessionStateModel {
  user: UserSessionDto;
}

@State<AppSessionStateModel>({
  name: 'appSession',
  defaults: {
    user: null,
  },
})
@Injectable()
export class AppSessionState {
  constructor(
    private userService: UserExtensionServiceProxy,
    private config: ConfigStateService,
    private appConfig_SP: OrdApplicationConfigurationServiceProxy,
  ) {
  }

  @Selector()
  static userSession(state: AppSessionStateModel) {
    return state.user;
  }

  @Action(GetUserSession)
  getUserSession({getState, setState}: StateContext<AppSessionStateModel>) {
    return forkJoin([this.userService.userSession(), this.appConfig_SP.getConfiguration()]).pipe(
      tap(([user, config]) => {
        if (config) {
          this.config.setState(config);
        }
        const state = getState();
        setState({
          ...state,
          user: user,
        });
        if (environment.production === false) {
          // console.log('usersession', user);
        }
      }),
    );
  }
}
