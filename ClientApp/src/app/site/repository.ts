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

    public listCustomers(filter: any) {
		return this.http.post(`/customer/basicList`, filter);
	}

    public getCustomer(id: string) {
		return this.http.post<any>(`/customer/get/${id}`);
	}

    public getCounties(stateId: number) {
        return this.http.post(`/site/countyList?stateId=${stateId}`);
    }

    public getSiteAnalytes(siteId: string) {
        return this.http.post(`/site/analyteList?siteId=${siteId}`);
    }

    public listAnalytes(filter: any) {
        return this.http.post(`/analyte/list`, filter);
    }
}
