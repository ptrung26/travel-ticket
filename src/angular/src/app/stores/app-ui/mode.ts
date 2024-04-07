import { Observable } from '@node_modules/rxjs';

export interface IDeleteCofrimRef {
  content: string;
  ok$: Observable<any>;
}
