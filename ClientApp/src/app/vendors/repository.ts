import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class VendorsRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/vendors/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/vendors/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/customers/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/vendors/list`, filter);
    }

    public statesList() {
        return this.http.post(`/vendors/getStatesList`);
    }

    public sitesList(filter: any) {
        return this.http.post(`/vendors/getSitesList`, filter);
    }
}
