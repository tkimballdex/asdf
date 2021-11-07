import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class UserRepository {
    constructor(private http: MsalHttpClient) {
    }

    public save(record: any) {
        return this.http.post<any>(`/user/save`, record);
    }

    public delete(id: string) {
        return this.http.post<boolean>(`/user/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/user/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/user/list`, filter);
    }

	public sendPasswordResetLink(id: string) {
		return this.http.post<boolean>(`/user/sendPasswordResetLink/${id}`);
	}
}
