import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class DemographicsdataRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/demographicdata/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/demographicdata/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/demographicdata/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/demographicdata/list`, filter);
    }

	public getData(siteId: any) {
		return this.http.post(`/demographicdata/getData/${siteId}`);
	}
}
