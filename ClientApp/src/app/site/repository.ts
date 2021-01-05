import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class SiteRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/site/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/site/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/site/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/site/list`, filter);
    }

    public statesList() {
        return this.http.post(`/site/getStatesList`);
    }

    public frequencyList() {
        return this.http.post(`/site/getFrequencyList`);
    }

    public locationsList(filter: any) {
        return this.http.post(`/site/getLocationsList`, filter);
    }
}
