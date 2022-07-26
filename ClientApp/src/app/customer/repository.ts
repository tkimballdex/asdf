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

    public listCustomerAnalytes(customerId: string) {
        return this.http.post(`/customerAnalyte/list?customerId=${customerId}`);
    }

    public saveCustomerAnalyte(data: any) {
        return this.http.post<any>(`/customerAnalyte/save`, data);
    }

    public deleteCustomerAnalyte(customerAnalyteId: any) {
        return this.http.post<any>(`/customerAnalyte/delete?id=${customerAnalyteId}`);
    }

    public getAnalyteName(id: string) {
        return this.http.post(`/analyte/get/${id}`);
    }

    public listTenantAnalytes(tenantId: any) {
        return this.http.post(`/site/tenantAnalytes?tenantId=${tenantId}`);
    }
}
