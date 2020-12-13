import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class RoleRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post(`/role/save`, record);
    }

    public delete(id: string) {
        return this.http.post<boolean>(`/role/delete/${id}`);
    }

    public get(id: number) {
        return this.http.post(`/role/get/${id}`);
    }

    public list() {
        return this.http.post(`/role/list`);
    }
}
