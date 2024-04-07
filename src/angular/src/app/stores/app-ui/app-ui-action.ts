import { IDeleteCofrimRef } from "./mode";


export class AppUiActionDeleteConfirmModalOpen {
  static readonly type = '[AppUi] DeleteConfirmModalOpen';

  constructor(public payload: IDeleteCofrimRef) {

  }
}
