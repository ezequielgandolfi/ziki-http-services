import { Observable } from "rxjs";

/**
 * Internal Response Model
 */
export class ResponseObjectModel<T> {
  public type;
  constructor(type: (new () => T))  { this.type = type;  }
  public createInstance(): T { return new this.type(); }
}

/**
 * HTTP service interface
 */
export interface IServiceRequest {
  get(url:string): Observable<Object>;
  post(url:string, data?:Object): Observable<Object>;
  put(url:string, data?:Object): Observable<Object>;
  delete(url:string): Observable<Object>;
}
