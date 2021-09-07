import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MsalHttpClient {
    constructor(private http: HttpClient) {
    }

    public post<T>(url: string, data?: any) {
        url = environment.webApi + url;
        return this.http.post<T>(url, data).toPromise();
    }

	public postBlob(url: string, data?: any) {
		url = environment.webApi + url;
		return this.http.post(url, data, { responseType: 'blob' }).toPromise();
	}
}
