import { Injectable } from "@angular/core";
import { MsalHttpClient } from './msal-http';
import { MsalService } from '@azure/msal-angular';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators'
import { Tenant, TenantService } from './tenant.service';
import { environment } from '../../environments/environment';

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
	public componentState = {};
	public readonly GuidEmpty = "00000000-0000-0000-0000-000000000000";
	public readonly activeStates: IdName[] = [{ id: 0, name: 'All' }, { id: 1, name: 'Active' }, { id: 2, name: 'Inactive' }];

	constructor(private authService: MsalService, private dataRepository: AppRepository, private tenant: TenantService) {
	}

	public getData() {
		return this.dataRepository.getData();
	}

	public async getPrivileges() {
		try {
			var data = await this.getData();
		}
		catch { }

		return data ? data.privileges : null;
	}

	public getAllYesNoList() {
		const data: IdName[] = [{ id: 0, name: 'All' }, { id: 1, name: 'Yes' }, { id: 2, name: 'No' }];
		return data;
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

	public saveFormState(page: any) {
		this.componentState[page.constructor.name] = page.form;
	}

	public getFormState(page: any) {
		return this.componentState[page.constructor.name];
	}

	public async getAccessToken() {
		return (await (this.authService.acquireTokenSilent({
			scopes: [environment.scope]
		}).toPromise())).accessToken;
	}

	public getFullUrl(path: string) {
		return environment.webApi + path;
	}

	public getNullableDate(date: any) {
		return date ? new Date(date) : null;
	}
}

export interface PrivilegeSet {
	create: boolean;
	read: boolean;
	update: boolean;
	delete: boolean;
	approve: boolean;
	download: boolean;
	communicate: boolean;
}

export interface Privileges {	
	privileges: PrivilegeSet;
	roles: PrivilegeSet;
	users: PrivilegeSet;
	newsArticles: PrivilegeSet;	
	customers: PrivilegeSet;
	sites: PrivilegeSet;
	locations: PrivilegeSet;	
	testTypes: PrivilegeSet;	
	vendors: PrivilegeSet;	
	samples: PrivilegeSet;
	tests: PrivilegeSet;
	states: PrivilegeSet;
	counties: PrivilegeSet;
	postalCodes: PrivilegeSet;
	analytes: PrivilegeSet;
	samplers: PrivilegeSet;
	collections: PrivilegeSet;
}

export interface MenuItem {
	id: number;
	text: string;
	icon: string;
	path: string;
}

export interface Country {
    id: number;
    name: string;
}

export interface County {
    id: number;
    name: string;
}

export interface State {
    id: number;
    name: string;
}

export interface Postalcode {
    id: number;
    name: string;
}

export interface Analyte {
    id: number;
    name: string;
}

export interface Testtype {
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

export interface UidName {
	id: string;
	name: string;
}

export interface IdName {
	id: number;
	name: string;
}

export interface AppData {
	email: string;
	userName: string;
	userId: string;
    privileges: Privileges;
    countries: Country[];
	counties: County[];
	states: State[];
    frequencies: Frequency[];
    vendortypes: VendorType[];
	menuItems: MenuItem[];
	tenants: Tenant[];
	analytes: UidName[]; 
	Postalcodes:Postalcode[];
	Analytes:Analyte[];
	testtypes:Testtype[];
}
