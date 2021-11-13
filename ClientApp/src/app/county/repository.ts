import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class CountyRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/county/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/county/delete/${id}`);
    }

    public get(id: number) {
        return this.http.post(`/county/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/county/list`, filter);
    }
}
