import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class DashboardRepository {
    constructor(private http: MsalHttpClient, private tenant: TenantService) {
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

	public getSites(filter: any) {
		return this.http.post<any>(`/dashboard/siteMap`, filter);
	}

	public getSummary(filter: any) {
		return this.http.post<any>(`/dashboard/daySummary`, filter);
	}
	public listLocations(siteId: string) {
		return this.http.post(`/location/list`, {
			tenantId: this.tenant.id,
			siteId: siteId
		});
	}

	public listCustomerLocations(customerId: string) {
		return this.http.post(`/location/list`, {
			tenantId: this.tenant.id,
			customerId: customerId
		});
	}

	public positiveCases(filter: any) {
		return this.http.post<any>(`/dashboard/positiveCases`, filter);
	}

	public positiveNegativeCases(filter: any) {
		return this.http.post<any>(`/dashboard/positiveNegativeCases`, filter);
	}

	public positiveSiteStack(filter: any) {
		return this.http.post<any[]>(`/dashboard/positiveSiteStack`, filter);
	}
}
