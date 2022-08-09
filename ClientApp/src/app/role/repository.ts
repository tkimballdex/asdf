import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class RoleRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/role/save`, record);
    }

    public delete(id: string) {
        return this.http.post<boolean>(`/role/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/role/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/role/list`, filter);
    }
}
