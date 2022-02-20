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
        return this.http.post<any>(`/collection/get/${id}`);
    }

    public save(record: any) {
        return this.http.post<any>(`/collection/save`, record);
    }	

	public saveSchedule(record: any) {
		return this.http.post<any>(`/collectionSchedule/save`, record);
	}

	public getData() {
		return this.http.post(`/collection/getData`);
	}

	public getScheduleData() {
		return this.http.post(`/collectionSchedule/getData/${this.tenant.id}`);
	}

    public delete(id: string) {
        return this.http.post<any>(`/collection/delete/${id}`);
    }   
	
	public getContainer(id: string) {
        return this.http.post(`/collectionContainer/get/${id}`);
    }

	public saveContainer(record: any) {
		return this.http.post<any>(`/collectionContainer/save`, record);
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
