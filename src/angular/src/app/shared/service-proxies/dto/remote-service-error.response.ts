export interface IResponseResult {
  isSuccessful: boolean;
  entity: any | undefined;
  result: any | undefined;
  message: string | undefined;
  errorMessage: string | undefined;
}

export class ResponseResult implements IResponseResult {
  isSuccessful!: boolean;
  entity!: any | undefined;
  result!: any | undefined;
  message!: string | undefined;
  errorMessage!: string | undefined;

  constructor(data?: IResponseResult) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.isSuccessful = _data['isSuccessful'];
      this.entity = _data['entity'];
      this.result = _data['result'];
      this.message = _data['message'];
      this.errorMessage = _data['errorMessage'];
    }
  }

  static fromJS(data: any): ResponseResult {
    data = typeof data === 'object' ? data : {};
    let result = new ResponseResult();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['isSuccessful'] = this.isSuccessful;
    data['entity'] = this.entity;
    data['result'] = this.result;
    data['message'] = this.message;
    data['errorMessage'] = this.errorMessage;
    return data;
  }
}
