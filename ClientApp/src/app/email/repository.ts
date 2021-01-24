import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';

@Injectable({ providedIn: 'root' })
export class EmailRepository {
    constructor(private http: MsalHttpClient) {
    }

    public sendEmail(record: any) {
        return this.http.post<any>(`/app/sendEmail`, record);
    }
}
