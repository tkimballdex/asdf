import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError, AuthError } from 'msal';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MsalHttpClient {
    constructor(private http: HttpClient, private authService: MsalService) {
    }

    public postWithErrorCheck(url: string, dataToPost: any, postback?: (data) => void) {
        url = environment.webApi + url;

        this.http.post(url, dataToPost).subscribe({
            next: (data) => {
                if (postback) postback(data);
            },
            error: (err: AuthError) => {
                this.authService.acquireTokenPopup({
                    scopes: this.authService.getScopesForEndpoint(url)
                }).then(() => {
                    this.http.post(url, dataToPost).toPromise().then(data => { if (postback) postback(data); });
                });
            }
        });
    }

    public post<T>(url: string, data?: any) {
        url = environment.webApi + url;
        return this.http.post<T>(url, data).toPromise();
    }
}
