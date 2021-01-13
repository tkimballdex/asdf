import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class CustomerRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/customer/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/customer/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/customer/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/customer/list`, filter);
    }
}
