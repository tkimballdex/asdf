import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class TestTypeRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/testType/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/testType/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/vendor/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/vendor/list`, filter);
    }

}
