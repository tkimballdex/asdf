import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class StateStatRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/statestat/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/statestat/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/statestat/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/statestat/list`, filter);
    }
}
