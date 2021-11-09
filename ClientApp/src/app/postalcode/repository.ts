import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class PostalcodeRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/postalcode/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/postalcode/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/postalcode/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/postalcode/list`, filter);
    }

	public getData(siteId: any) {
		return this.http.post(`/postalcode/getData/${siteId}`);
	}
}
