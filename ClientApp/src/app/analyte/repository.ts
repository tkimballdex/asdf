import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class AnalyteRepository {
    constructor(private http: MsalHttpClient, private tenant: TenantService) {
    }

    public save(record: any) {
        return this.http.post<any>(`/analyte/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/analyte/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/analyte/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/analyte/list`, filter);
    }
}
