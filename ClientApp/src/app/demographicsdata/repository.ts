import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class DemographicsdataRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/demographicsdata/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/demographicsdata/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/demographicsdata/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/demographicsdata/list`, filter);
    }

	public getData(siteId: any) {
		return this.http.post(`/demographicsdata/getData/${siteId}`);
	}
}
