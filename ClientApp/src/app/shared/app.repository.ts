import { Injectable } from "@angular/core";
import { MsalHttpClient } from './msal-http';

@Injectable({ providedIn : 'root'})
export class AppRepository {
    constructor(private http: MsalHttpClient) {
	}

	appData: Promise<Object>;

	public getData() {
		if (this.appData == null) {
			try {
                this.appData = this.http.post('/application/getData', null);
			}
			catch (ex) {
				if (ex && ex.status == 401) {
				}
			}
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
}

export interface PrivilegeSet {
	Create: boolean;
	Read: boolean;
	Update: boolean;
	Delete: boolean;
	Approve: boolean;
}

export interface Privileges {
	ManagePrivileges: PrivilegeSet;
	ManageUsers: PrivilegeSet;
	ManageRoles: PrivilegeSet;
	ImportWarrantyData: PrivilegeSet;
	WorkOrders: PrivilegeSet;
}

export interface MenuItem {
	id: number;
	text: string;
	icon: string;
	path: string;
}

export interface AppData {
	privileges: Privileges;
	menuItems: MenuItem[];
}
