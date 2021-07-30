import { Injectable } from "@angular/core";
import { MsalHttpClient } from './msal-http';
import { MsalService } from '@azure/msal-angular';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators'
import { Tenant, TenantService } from './tenant.service';

export enum AppEventType {
    SendEmail = 'SendEmail',
	SendSms = 'SendSms'
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


@Injectable({ providedIn: 'root' })
export class AppRepository {
	constructor(private http: MsalHttpClient) {
	}

	appData: Promise<AppData>;

	public getData() {
		if (this.appData == null) {
			this.appData = this.http.post('/app/getData', null);
		}

		return this.appData;
	}
}


@Injectable({ providedIn : 'root'})
export class AppService {
	constructor(private authService: MsalService, private dataRepository: AppRepository, private tenant: TenantService) {
	}

	public getData() {
		return this.dataRepository.getData();
	}

	public async getPrivileges() {
		var data = await this.getData();
		return data.privileges;
    }

    public get userName() {
		var account = this.authService.instance.getActiveAccount();
		return account ? account.name : null;
	}

	public get isLoggedIn() {
		var account = this.authService.instance.getActiveAccount();
		return account && account.name;
	}

	public get tenantId() {
		return this.tenant.id;
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
	manageTenants: PrivilegeSet;
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

export interface AppData {
    email: string;
    privileges: Privileges;
    states: State[];
    frequencies: Frequency[];
    vendortypes: VendorType[];
	menuItems: MenuItem[];
	tenants: Tenant[];
}
