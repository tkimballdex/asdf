import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class CountystatRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/countystat/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/countystat/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/countystat/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/countystat/list`, filter);
    }

    public getCounty(id: number) {
        return this.http.post(`/county/get/${id}`);
    }
}
