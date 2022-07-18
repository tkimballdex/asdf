import { Injectable } from "@angular/core";
import { MsalHttpClient } from '../shared/msal-http';
import { TenantService } from '../shared/tenant.service';

@Injectable({ providedIn: 'root' })
export class DashboardRepository {
    constructor(private http: MsalHttpClient, private tenant: TenantService) {
    }

	public getGraphData(filter: any) {
		return this.http.post<any>(`/dashboard/getGraphData`, filter);
	}

	public dailySummary(filter: any) {
		return this.http.post<any>(`/dashboard/dailySummary`, filter);
	}

	public getData() {
		return this.http.post(`/dashboard/getData`, {
			tenantId: this.tenant.id
		});
	}

	public communicate(filter: any) {
		return this.http.post<any>(`/dashboard/communicate`, filter);
	}

	public listSites(customerId: string) {
		return this.http.post(`/site/list`, {
			tenantId: this.tenant.id,
			customerId: customerId
		});
	}
}
