import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class TestTypeRepository {
	constructor(private http: MsalHttpClient, private tenant: TenantService) {
    }

    public save(record: any) {
        return this.http.post<any>(`/testType/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/testType/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/testType/get/${id}?tenantId=${this.tenant.id}`);
    }

    public list(filter: any) {
        return this.http.post(`/testType/list`, filter);
    }

}
