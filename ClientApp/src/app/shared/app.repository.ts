import { Injectable } from "@angular/core";
import { MsalHttpClient } from './msal-http';
import { MsalService } from '@azure/msal-angular';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators'

export enum AppEventType {
    SendEmail = 'SendEmail'
}

export class AppEvent<T> {
    constructor(
        public type: AppEventType,
        public payload: T,
    ) { }
}

@Injectable({ providedIn: 'root' })
export class EventQueueService {

    private eventBrocker = new Subject<AppEvent<any>>();

    on(eventType: AppEventType): Observable<AppEvent<any>> {
        return this.eventBrocker.pipe(filter(event => event.type === eventType));
    }

    dispatch<T>(event: AppEvent<T>): void {
        this.eventBrocker.next(event);
    }
}

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

    public get tenantName() {
        return sessionStorage.getItem('tenant');
    }

    public get tenantId() {
        return sessionStorage.getItem('tenantId');
    }

	public setTenant(t: Tenant) {
		sessionStorage.setItem('tenantId', t.id);
		sessionStorage.setItem('tenant', t.name);
	}

    public get userName() {
        var account = this.authService.getAccount();
        return account ? account.name : null;
	}

	public get isLoggedIn() {
		var account = this.authService.getAccount();
		return account && account.name;
	}

    public tenantList() {
        return this.http.post<Tenant[]>(`/user/getTenantList`);
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
    testTypes: PrivilegeSet;
    samples: PrivilegeSet;
    tests: PrivilegeSet;
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

export interface VendorType {
    id: number;
    name: string;
}

export interface Tenant {
	id: string;
	name: string;
}

export interface AppData {
    email: string;
    privileges: Privileges;
    states: State[];
    frequencies: Frequency[];
    vendortypes: VendorType[];
	menuItems: MenuItem[];
}
