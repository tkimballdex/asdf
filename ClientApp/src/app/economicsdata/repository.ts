import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class economicsdataRepositary {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/economicsdata/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/economicsdata/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/economicsdata/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/economicsdata/list`, filter);
    }

	public getData(siteId: any) {
		return this.http.post(`/economicsdata/getData/${siteId}`);
	}
}
