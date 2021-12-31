import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class CollectionRepository {
    constructor(private http: MsalHttpClient, private tenant: TenantService) {
    }

	public list(filter: any) {
        return this.http.post(`/collection/list`, filter);
    }

	public get(id: string) {
        return this.http.post(`/collection/get/${id}`);
    }

    public save(record: any) {
        return this.http.post<any>(`/collection/save`, record);
    }

	public getData() {
		return this.http.post(`/collection/getData`);
	}

    public delete(id: string) {
        return this.http.post<any>(`/sample/delete/${id}`);
    }        

	public getTests(sampleId: string) {
		return this.http.post(`/sampletest/list`, {
			sampleId: sampleId,
			tenantId: this.tenant.id
		});
	}

	public listCustomers() {
		return this.http.post(`/customer/list`, {
			tenantId: this.tenant.id
		});
	}

	public listSites(customerId: string) {
		return this.http.post(`/site/list`, {
			tenantId: this.tenant.id,
			customerId: customerId
		});
	}

	public listLocations(siteId: string) {
		return this.http.post(`/location/list`, {
			tenantId: this.tenant.id,
			siteId: siteId
		});
	}

	public listVendors() {
		return this.http.post(`/vendor/list`, { tenantId: this.tenant.id });
	}
}
