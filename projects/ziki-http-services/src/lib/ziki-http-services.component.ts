import { HttpClient } from "@angular/common/http";
import { ResponseObjectModel, IServiceRequest } from "./models/request.model";
import { take } from "rxjs/operators";
import { DataService } from "./ziki-http-services.module";

export class ZikiHttpServices<T> {
    private _type;
    private _url: string;
    private _http: HttpClient;
    private _queryParams: any;
    private _pathParams: any;

    public static getInstance<T>(url?: string): ZikiHttpServices<T>;
    public static getInstance<T>(type?: any, url?: string): ZikiHttpServices<T>;
    public static getInstance<T>(typeOrUrl?: any, url?: string): ZikiHttpServices<T> {
        let _type;
        let _url;
        if (!typeOrUrl) {
            _type = Object;
        }
        else if (typeOrUrl instanceof String || typeof(typeOrUrl) == "string") {
            _type = Object;
            _url = typeOrUrl;
        }
        else {
            _type = typeOrUrl;
            _url = url;
        }
        let instance = new ZikiHttpServices<T>(_type, DataService().HttpClient).setURL(_url);
        return instance;
    }
 
    constructor(private type: {new():T}, private httpClient?: HttpClient) {
        this._type = type;
        this._http = httpClient;
    }

    public setHttpClient(httpClient: HttpClient): ZikiHttpServices<T> {
        this._http = httpClient;
        return this;
    }

    public setURL(url: string): ZikiHttpServices<T> {
        this._url = url;
        return this;
    }

    public setQueryParams(queryParams?: any): ZikiHttpServices<T> {
        this._queryParams = queryParams;
        return this;
    }
    
    public setPathParams(model?: any): ZikiHttpServices<T> {
        this._pathParams = model;
        return this;
    }
    //#endregion

    //#region HTTP
    private _get(url?: string): Promise<T> {
        let requestUrl = (url || this._url);
        requestUrl = this.appendPathParams(requestUrl);
        requestUrl = this.appendQueryParams(requestUrl);
        let requestHttp = this.getServiceRequest();
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.get(requestUrl).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data));
                },
                error => reject(error)
            );
        });
    }

    public get(url?: string): Promise<T> {
        return <Promise<T>>this._get(url);
    }

    public post(data: any, url?: string): Promise<T> {
        let requestUrl = (url || this._url);
        requestUrl = this.appendPathParams(requestUrl);
        requestUrl = this.appendQueryParams(requestUrl);
        let requestHttp = this.getServiceRequest(requestUrl);
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.post(requestUrl, data).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data));
                },
                error => reject(error)
            );
        });
    }

    public put(data: any, url?: string): Promise<T> {
        let requestUrl = (url || this._url);
        requestUrl = this.appendPathParams(requestUrl);
        requestUrl = this.appendQueryParams(requestUrl);
        let requestHttp = this.getServiceRequest(requestUrl);
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.put(requestUrl, data).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data));
                },
                error => reject(error)
            );
        });
    }

    public delete(url?: string): Promise<T> {
        let requestUrl = (url || this._url);
        requestUrl = this.appendPathParams(requestUrl);
        requestUrl = this.appendQueryParams(requestUrl);
        let requestHttp = this.getServiceRequest(requestUrl);
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.delete(requestUrl).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data));
                },
                error => reject(error)
            );
        });
    }
    //#endregion

    //#region URI
    private appendPathParams(url: string): string {
        let newUrl = url;
        let params = this._pathParams;
        if (params) {
            return newUrl.replace(/{{([\w\d\-]+)}}/gi, function(subs, args: string) { 
                return this.encodeURIParam(params[args.trim()]);
            });
        }
        return newUrl;
    }

    private appendQueryParams(url: string): string {
        let _fullUrl = url;
        let _params = [];
        if (this._queryParams)
            Object.keys(this._queryParams).filter(key => !!this._queryParams[key]).forEach(key => _params.push(key + '=' + this.encodeURIParam(this._queryParams[key])));
        _params = [..._params,...this.additionalQueryParams()];
        if (_params.length > 0)
            _fullUrl += ((_fullUrl.indexOf('?') < 0) ? '?' : '&') + _params.join('&');
        return _fullUrl;
    }

    protected additionalQueryParams(): string[] {
        return [];
    }
    //#endregion

    //#region Conversion
    protected resultFactory(data: any): T | T[] {
        if (!data)
            return;
        if (this.resultIsArray(data)) {
            let newItems: T[] = data.map(item => {return this.itemFactory(item)});
            return newItems;
        }
        return this.itemFactory(data);
    }

    protected itemFactory(data: any): T {
        let obj = new ResponseObjectModel<T>(this._type).createInstance();
        this.parseObject(obj, data);
        return obj;
    }

    protected parseObject(instance, data) {
        Object.assign(instance, data);
        return instance;
    }

    protected resultIsArray(arg): arg is Array<T> {
        return (Array.isArray(arg));
    }

    protected getServiceRequest(url?: string): IServiceRequest {
        return this._http;
    }
    //#endregion

    //#region internal
    encodeURIParam(data: any): string {
        if (data) {
            if (data instanceof Boolean || typeof (data) === "boolean") {
                return data.toString();
            }
            if (data instanceof Date) {
                return [
                    data.getFullYear().toString().padStart(4, '0'),
                    (data.getMonth() + 1).toString().padStart(2, '0'),
                    data.getDate().toString().padStart(2, '0')
                ].join('-');
            }
            return encodeURIComponent(data);
        }
        return '';
    }
    //#endregion

}
