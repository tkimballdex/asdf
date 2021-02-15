import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AppRepository } from './app.service';

@Injectable({ providedIn : 'root'})
export class TenantService {
	constructor(private dataRepository: AppRepository, private router: Router) {
	}

    public get name() {
        return localStorage.getItem('tenant');
    }

    public get id() {
		return localStorage.getItem('tenantId');
    }

	public set(t: Tenant) {
		localStorage.setItem('tenantId', t.id);
		localStorage.setItem('tenant', t.name);
	}

	public clear() {
		localStorage.removeItem('tenantId');
		localStorage.removeItem('tenant');
	}

	public async getList() {
		var data = await this.dataRepository.getData();
		return data.tenants;
	}

	public async validate() {
		var tenants = await this.getList();

		if (!tenants || !tenants.length) {
			this.clear();
		}
		else if (tenants.length == 1) {
			this.set(tenants[0]);
		}
		else if (this.id && !tenants.some(x => x.id == this.id)) {
			this.clear();
		}

		if (!this.id) {
			console.dir('Tenant is not set, redirecting to choose tenant page');
			this.router.navigate(['/auth/account/tenant']);
		}
	}
}

export interface Tenant {
	id: string;
	name: string;
}
