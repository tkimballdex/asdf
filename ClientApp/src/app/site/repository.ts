import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class SiteRepository {
    constructor(private http: MsalHttpClient) {
    }

    public getSiteData(siteId: string) {
        return this.http.post<any>(`/site/getData?siteId=${siteId}`);
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

    public listSiteAnalytes(siteId: string) {
        return this.http.post(`/siteAnalyte/list?siteId=${siteId}`);
    }

    public saveSiteAnalyte(data: any) {
        return this.http.post<any>(`/siteAnalyte/save`, data);
    }

    public deleteSiteAnalyte(siteAnalyteId: any) {
        return this.http.post<any>(`/siteAnalyte/delete?id=${siteAnalyteId}`);
    }

    public getAnalyte(id: string) {
        return this.http.post(`/analyte/get/${id}`);
    }

    public listAnalytes(filter: any) {
        return this.http.post(`/analyte/list`, filter);
    }

    public listTenantAnalytes(tenantId: any) {
        return this.http.post(`/site/tenantAnalytes?tenantId=${tenantId}`);
    }
}
