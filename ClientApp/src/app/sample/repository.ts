import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class SampleRepository {
    constructor(private http: MsalHttpClient, private tenant: TenantService) {
    }

    public save(record: any) {
        return this.http.post<any>(`/sample/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/sample/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post(`/sample/get/${id}`);
    }

    public list(filter: any) {
        return this.http.post(`/sample/list`, filter);
    }

	public getCollection(id: string) {
		return this.http.post<any>(`/collection/get/${id}`);
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

	public listCollections(locationId: string) {
		return this.http.post(`/collection/list`, {
			tenantId: this.tenant.id,
			locationId: locationId
		});
	}

	public listVendors(filter: any) {
		return this.http.post(`/vendor/list`, filter);
	}
}
