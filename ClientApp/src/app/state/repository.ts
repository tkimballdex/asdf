import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class StateRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/state/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/state/delete/${id}`);
    }

    public get(id: number) {
        return this.http.post(`/state/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/state/list`, filter);
    }

	//public getData(id: any) {
	//	return this.http.post(`/state/getData/${id}`);
	//}
}
