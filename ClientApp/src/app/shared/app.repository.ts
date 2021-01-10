import { Injectable } from "@angular/core";
import { MsalHttpClient } from './msal-http';
import { MsalService } from '@azure/msal-angular';

@Injectable({ providedIn : 'root'})
export class AppRepository {
    constructor(private http: MsalHttpClient, private authService: MsalService) {
	}

	appData: Promise<AppData>;

	public getData() {
		if (this.appData == null) {
            this.appData = this.http.post('/app/getData', null);
		}

		return this.appData;
	}

	public async getPrivileges() {
		var data = await this.getData();
		return (<AppData>data).privileges;
    }

    public get tenant() {
        return sessionStorage.getItem('tenant');
    }

    public set tenant(value: string) {
        sessionStorage.setItem('tenant', value);
    }

    public get userName() {
        var account = this.authService.getAccount();
        return account ? account.name : null;
    }

    public tenantList() {
        return this.http.post(`/user/getTenantList`);
    }
}

export interface PrivilegeSet {
	create: boolean;
	read: boolean;
	update: boolean;
	delete: boolean;
	approve: boolean;
}

export interface Privileges {
	managePrivileges: PrivilegeSet;
	manageUsers: PrivilegeSet;
	manageRoles: PrivilegeSet;
	customers: PrivilegeSet;
    sites: PrivilegeSet;
    locations: PrivilegeSet;
    vendors: PrivilegeSet;
}

export interface MenuItem {
	id: number;
	text: string;
	icon: string;
	path: string;
}

export interface State {
    id: number;
    name: string;
}

export interface Frequency {
    id: number;
    name: string;
}

export interface AppData {
    privileges: Privileges;
    states: State[];
    frequencies: Frequency[];
	menuItems: MenuItem[];
}
