import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class SamplerRepository {
    constructor(private http: MsalHttpClient, private tenant: TenantService) {
    }

    public save(record: any) {
        return this.http.post<any>(`/sampler/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/sampler/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/sampler/get/${id}`);
    }

	public getData() {
		return this.http.post(`/sampler/getData/${this.tenant.id}`);
	}

    public list(filter: any) {
        return this.http.post(`/sampler/list`, filter);
    }
}
