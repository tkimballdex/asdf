import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class SampleTestRepository {
    constructor(private http: MsalHttpClient, private tenant: TenantService) {
    }

    public save(record: any) {
        return this.http.post<any>(`/sampletest/save`, record);
    }

    public delete(id: string) {
        return this.http.post<any>(`/sampletest/delete/${id}`);
    }

    public get(id: string) {
        return this.http.post<any>(`/sampletest/get/${id}`);
    }

	public getData() {
		return this.http.post<any>(`/sampletest/getData`);
	}

    public list(filter: any) {
        return this.http.post(`/sampletest/list`, filter);
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

	public listSamples(locationId: string) {
		return this.http.post(`/sample/list`, {
			tenantId: this.tenant.id,
			locationId: locationId
		});
	}

    public sendAlertsAndNotifications() {
		return this.http.post<any>(`/notification/sendAlertsAndNotifications/${this.tenant.id}`);
    }
}
