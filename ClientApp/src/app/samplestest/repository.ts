import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class SampleRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/sample/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/sample/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/sample/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/sample/list`, filter);
    }

}
