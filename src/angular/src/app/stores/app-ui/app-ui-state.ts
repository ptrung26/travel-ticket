import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IDeleteCofrimRef } from './mode';
import { AppUiActionDeleteConfirmModalOpen } from './app-ui-action';


export class AppUiStateModel {
  deleteConfirmModal: IDeleteCofrimRef;
}

@State<AppUiStateModel>({
  name: 'appUi',
  defaults: {
    deleteConfirmModal: null
  }
})
@Injectable()
export class AppUiState {

  constructor() {
  }

  @Selector()
  static deleteConfirmModal(state: AppUiStateModel) {
    return state.deleteConfirmModal;
  }

  @Action(AppUiActionDeleteConfirmModalOpen)
  openDeleteConfirm(ctx: StateContext<AppUiStateModel>,
    { payload }: AppUiActionDeleteConfirmModalOpen) {
    ctx.patchState({
      deleteConfirmModal: payload
    });
  }
}
