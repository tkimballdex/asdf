import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class VendorRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/vendor/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/vendor/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/vendor/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/vendor/list`, filter);
    }

    public listCustomers(filter: any) {
		return this.http.post(`/customer/basicList`, filter);
	}
}
