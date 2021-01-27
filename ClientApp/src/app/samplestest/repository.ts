import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class SampleTestRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/sampletest/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/sampletest/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/sampletest/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/sampletest/list`, filter);
    }

}
