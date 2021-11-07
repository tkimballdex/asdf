import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class PostalcodeRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/location/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/location/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/location/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/location/list`, filter);
    }

	public getData(siteId: any) {
		return this.http.post(`/location/getData/${siteId}`);
	}
}
